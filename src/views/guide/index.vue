<template>
  <div class="app-container">
    <!-- 头部搜索框 -->
    <div style="width: 300px;float: left;">
      <el-input
        v-model="input4"
        placeholder="请输入客户名称/客户编号"
        style="width: 185px;float: left;"
        size="small"
      />
      <el-popover
        placement="bottom"
        width="420"
        trigger="click"
      >
        <el-button
          slot="reference"
          style="margin-left: -1px;height: 32px;background-color:#F0F0F0"
          size="small"
        >
          <i class="iconfont">&#xe64a;</i>
        </el-button>
        <el-form ref="form" :model="form_1" label-width="100px" label-position="left">
          <el-form-item label="客户编号">
            <el-input v-model="form_1.code" size="mini" clearable/>
          </el-form-item>
          <el-form-item label="注册日期" style="margin-top: -15px">
            <el-date-picker
              v-model="form_1.value"
              style="width:127px"
              type="month"
              size="mini"
              format="yyyy年MM月"
              value-format="yyyyMM"
              placeholder="选择月"/>
            <span>至</span>
            <el-date-picker
              v-model="form_1.value1"
              style="width:127px"
              type="month"
              size="mini"
              format="yyyy年MM月"
              value-format="yyyyMM"
              placeholder="选择月"/>
          </el-form-item>
          <el-form-item label="客户名称" style="margin-top: -15px">
            <el-input v-model="form_1.name" size="mini" clearable/>
          </el-form-item>
          <el-form-item style="text-align: right;margin-top: -18px;margin-bottom: -15px">
            <el-button type="primary" size="mini" @click="zy_sx">查找</el-button>
          </el-form-item>
        </el-form>
      </el-popover>
    </div>
    <!-- 头部按钮 -->
    <div style="float: right;">
      <el-button type="primary" size="mini" @click="dialogVisible=true">
        <i class="iconfont">&#xe621;</i> 新 增
      </el-button>
      <el-button size="mini" @click="delete_zhu">
        <i class="iconfont">&#xe602;</i> 删 除
      </el-button>
    </div>
    <!-- 表格 -->
    <div>
      <el-table
        :data="tables"
        style="width: 100%"
        size="mini"
        stripe
        height="705"
        resizable
        @select="select"
        @selection-change="selec_change"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column label="序号" width="80" align="center" sortable>
          <template slot-scope="scope">
            <span>{{ scope.$index+1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户名称" width="250" sortable/>
        <el-table-column prop="code" label="客户编号" width="120" sortable/>
        <el-table-column
          :render-header="renderHeader"
          prop="address"
          label="所属区域"
          show-overflow-tooltip
          width="250"
        />
        <el-table-column prop="data" label="注册日期" sortable/>
        <el-table-column prop="money" label="累计消费（元）" sortable/>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="upd_tabel(scope.$index, scope.row)">修 改</el-button>|
            <el-button
              type="text"
              style="margin-left:0px"
              @click.native.prevent="deleteRow(scope.$index, tableData)"
            >删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage4"
        :page-sizes="[1, 5,10,15,20]"
        :page-size="pagesize"
        :total="tableData.length"
        style="float: right;margin-bottom: -50px;"
        layout="total, sizes, prev, pager, next,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 修改弹框 -->
    <div>
      <el-dialog
        :visible.sync="dialogVisible_upd"
        :before-close="handleClose_upd"
        title="客户信息修改:"
        width="30%"
      >
        <el-form ref="form_upd" :model="form_upd" label-width="100px">
          <el-form-item label="客户名称">
            <el-input v-model="form_upd.name" size="medium" style="width: 300px">
              <i slot="prefix" class="iconfont">&#xe622;</i>
            </el-input>
          </el-form-item>
          <el-form-item label="客户编号">
            <el-input v-model="form_upd.code" size="medium" style="width: 300px">
              <i slot="prefix" class="iconfont">&#xe655;</i>
            </el-input>
          </el-form-item>
          <el-form-item label="所属区域">
            <el-input v-model="form_upd.addes" size="medium" style="width: 300px">
              <i slot="prefix" class="iconfont">&#xe61a;</i>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible_upd = false">取 消</el-button>
          <el-button type="primary" @click="dialog_upd">修改</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 新增对话框 -->
    <div>
      <el-dialog
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        top="50px"
        width="1200px"
      >
        <el-tabs type="border-card" stretch>
          <el-tab-pane label="基础信息">
            <el-form ref="form" :model="form_2" :inline="true" label-width="100px" size="mini">
              <el-form-item label="客户名称:" label-width="90px">
                <el-input v-model="form_2.name" size="medium"/>
              </el-form-item>
              <el-form-item label="客户性质:">
                <el-radio-group v-model="form_2.radio" @change="radio_change">
                  <el-radio :label="1">自然人</el-radio>
                  <el-radio :label="2" style="margin-left: 4px">企业/单位</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="show_item" label="企业社会信用代码:" label-width="130px">
                <el-input v-model="form_2.qydm" size="medium"/>
              </el-form-item>
              <el-form-item v-if="!show_item" label="证件号码(身份证):" label-width="130px">
                <el-input v-model="form_2.sfz" size="medium"/>
              </el-form-item>
              <el-form-item style="margin-left: 100px">
                <el-button size="mini" round type="primary" @click="dialogFormVisible_2=true">实名认证</el-button>
              </el-form-item>
              <!-- <el-form-item label="所属地区:">
                <VDistpicker @selected="onSelected"/>
              </el-form-item> -->
              <el-form-item label="所属地区:" style="margin-left:-10px;">
                <linkage/>
              </el-form-item>
              <el-form-item style>
                <div
                  style="margin-left: 5px; width: 1115px; border-bottom:#000000 1px dashed;float: right;font-size: 15px;font-weight:bold"
                >税务信息</div>
              </el-form-item>
              <el-form-item label="网报账号:" label-width="140px">
                <el-input v-model="form_2.wbzh" size="medium"/>
              </el-form-item>
              <el-form-item label="网报密码:" label-width="140px">
                <el-input v-model="form_2.wbmm" size="medium"/>
              </el-form-item>
              <el-form-item label="纳税人识别号:" label-width="140px">
                <el-input v-model="form_2.nsrsbh" size="medium"/>
              </el-form-item>
              <el-form-item label="纳税人性质:" label-width="140px">
                <el-select v-model="form_2.nsrxz" size="small">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="税控盘口令:" label-width="140px">
                <el-input v-model="form_2.skpkl" size="medium"/>
              </el-form-item>
              <el-form-item label="发票确认平台密码:" label-width="140px">
                <el-input v-model="form_2.ptmm" size="medium"/>
              </el-form-item>
              <el-form-item>
                <div
                  style="margin-left: 5px; width: 1115px; border-bottom:#000000 1px dashed;float: right;font-size: 15px;font-weight:bold"
                >联系人</div>
              </el-form-item>
              <el-form-item>
                <div style="margin-left: 5px; width: 1115px;">
                  <div slot="header" class="clearfix">
                    <el-button type="primary" style="margin-left: 1080px" @click="save_add">保存</el-button>
                  </div>
                  <el-table
                    :data="tableData_add"
                    style="width: 100%"
                    size="mini"
                    max-height="250"
                    @cell-click="clickCell"
                  >
                    <el-table-column label="姓名" width="80">
                      <template slot-scope="scope">
                        <el-input v-if="scope.row.is_show" v-model="scope.row.names"/>
                        <span v-else-if="!scope.row.is_show">{{ scope.row.names }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="职位">
                      <template slot-scope="scope">
                        <el-input v-if="scope.row.is_show" v-model="scope.row.job"/>
                        <span v-else>{{ scope.row.job }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="手机" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-input v-if="scope.row.is_show" v-model="scope.row.phone"/>
                        <span v-else>{{ scope.row.phone }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="Email" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-input v-if="scope.row.is_show" v-model="scope.row.email"/>
                        <span v-else>{{ scope.row.email }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="QQ/微信" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-input v-if="scope.row.is_show" v-model="scope.row.qq"/>
                        <span v-else>{{ scope.row.qq }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="85">
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          type="text"
                          @click="handleAdd(scope.$index, scope.row)"
                        >
                          <i class="iconfont" style="color:#3478d9;font-size: 18px">&#xe60d;</i>
                        </el-button>
                        <el-button
                          size="mini"
                          type="text"
                          @click.native.prevent="handleDelete(scope.$index, tableData_add)"
                        >
                          <i class="iconfont" style="color: #C0C0C0;font-size: 17px">&#xe605;</i>
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="合同">
            <!-- 合同搜索框 -->
            <div style="width: 300px;float: left;">
              <el-input
                v-model="input_ht"
                placeholder="请输入"
                style="width: 200px;float: left;"
                size="small"
              />
              <el-popover
                placement="bottom"
                width="350"
                trigger="click"
                content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
              >
                <el-button
                  slot="reference"
                  style="margin-left: -1px;height: 32px;background-color:#F0F0F0"
                  size="small"
                >
                  <i class="iconfont">&#xe64a;</i>
                </el-button>
                <el-form ref="form" :model="form_3" label-width="100px" label-position="left">
                  <el-form-item label="合同编号">
                    <el-input v-model="form_3.htbh" size="mini" clearable/>
                  </el-form-item>
                  <el-form-item label="签订日期" style="margin-top: -22px">
                    <el-input v-model="form_3.qdrq" size="mini" clearable/>
                  </el-form-item>
                  <el-form-item label="销售人员" style="margin-top: -22px">
                    <el-input v-model="form_3.xsry" size="mini" clearable/>
                  </el-form-item>
                  <el-form-item label="客户签字人" style="margin-top: -22px">
                    <el-input v-model="form_3.khqzr" size="mini" clearable/>
                  </el-form-item>
                  <el-form-item label="财道签字人" style="margin-top: -22px">
                    <el-input v-model="form_3.cdqzr" size="mini" clearable/>
                  </el-form-item>
                  <el-form-item style="text-align: right;margin-top: -18px;margin-bottom: -15px">
                    <el-button type="primary" size="mini" @click="ht_sx">查找</el-button>
                  </el-form-item>
                </el-form>
              </el-popover>
            </div>
            <!-- 新增合同按钮 -->
            <div style="float: right;">
              <el-button type="text" size="mini" @click="add_ht">新增合同</el-button>
            </div>
            <!-- 合同表格 -->
            <div>
              <el-table :data="tableData_ht" height="410" style="width: 100%">
                <el-table-column label="序号" type="index" width="50" align="center"/>
                <el-table-column label="合同名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button type="text" @click="dialogVisible_hts">{{ scope.row.contract_name }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="合同编号" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="dialogVisible_hts"
                    >{{ scope.row.contract_number }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="ht_data" label="签订日期" show-overflow-tooltip/>
                <el-table-column prop="ht_money" label="合同金额" show-overflow-tooltip/>
                <el-table-column prop="client_signatory" label="客户签字人" show-overflow-tooltip/>
                <el-table-column label="财道签字人" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="show_lxrxx(scope.row.financial_street_signatory)"
                    >{{ scope.row.financial_street_signatory }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="销售人员" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="show_lxrxx(scope.row.salesman)"
                    >{{ scope.row.salesman }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button type="text" @click="dd_open">订 单</el-button>|
                    <el-button
                      type="text"
                      style="margin-left:0px"
                      @click.native.prevent="deleteRow_ht(scope.$index, tableData_ht,scope.row)"
                    >删 除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 合同底部保存按钮 -->
            <div>
              <el-button
                type="primary"
                size="mini"
                style="margin-left: 1080px;margin-top: 5px;margin-bottom: -10px"
                @click="save_add"
              >保存</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="支付">
            <el-card class="box-card" style="height: 100px;margin-bottom: 20px" shadow="hover">
              <div slot="header" class="clearfix">
                <span>消费总览</span>
                <el-button style="float: right; padding: 3px 0" type="text">充值</el-button>
              </div>
              <div style="text-align: center;margin-top: 10px">
                <span style="margin-left: 5px">累计消费：￥212321.82</span>
                <span style="margin-left: 30px">当前欠费：</span>
                <el-button type="text">￥22132.23</el-button>
                <el-button type="text" style="margin-left: 5px" @click="zf1_click">支付</el-button>
                <span style="margin-left: 30px">充值账户余额：￥0.00</span>
                <el-button type="text" style="margin-left: 5px" @click="dialogVisible_cz=true">充值</el-button>
              </div>
            </el-card>
            <div>
              <el-input
                v-model="input_dd"
                placeholder="请输入客户名称/客户编号"
                style="width: 180px;float: left;"
                size="small"
              />
              <el-popover placement="bottom" width="400" trigger="click">
                <el-button
                  slot="reference"
                  style="margin-left: -1px;height: 32px;background-color:#F0F0F0"
                  size="small"
                >
                  <i class="iconfont">&#xe64a;</i>
                </el-button>
                <el-form ref="form" :model="form_1" label-width="100px" label-position="left">
                  <el-form-item label="商品名称">
                    <el-input v-model="form_1.code" size="mini" clearable/>
                  </el-form-item>
                  <el-form-item label="有效期" style="margin-top: -15px;">
                    <el-date-picker
                      v-model="form_1.value"
                      :picker-options="pickerOptions2"
                      style="width: 274px"
                      size="mini"
                      type="daterange"
                      align="left"
                      value-format="yyyyMMdd"
                      unlink-panels
                      range-separator="至 "
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    />
                  </el-form-item>
                  <el-form-item label="订单编号" style="margin-top: -15px">
                    <el-input v-model="form_1.name" size="mini" clearable/>
                  </el-form-item>
                  <el-form-item style="text-align: right;margin-top: -18px;margin-bottom: -15px">
                    <el-button type="primary" size="mini" @click="zy_sx">查找</el-button>
                  </el-form-item>
                </el-form>
              </el-popover>
            </div>
            <el-table :data="tables_dd" size="mini" stripe height="305" style="width: 100%">
              <el-table-column type="index" label="序号" width="80"/>
              <el-table-column label="订单编号">
                <template slot-scope="scope">
                  <el-button type="text" @click="dialogVisible_dds">{{ scope.row.ddbh }}</el-button>
                </template>
              </el-table-column>
              <el-table-column sortable prop="spmc" label="商品名称"/>
              <el-table-column prop="yxq" label="有效期"/>
              <el-table-column label="计费周期">
                <template slot-scope="scope">
                  <span v-if="scope.row.jfzq===1">年</span>
                  <span v-if="scope.row.jfzq===2">月</span>
                  <span v-if="scope.row.jfzq===3">季</span>
                </template>
              </el-table-column>
              <el-table-column label="欠费金额">
                <template slot-scope="scope">
                  <el-button type="text">{{ scope.row.qfje }}</el-button>
                </template>
              </el-table-column>
              <el-table-column label="结算方式">
                <template slot-scope="scope">
                  <span v-if="scope.row.jsfs===1">手动支付</span>
                  <span v-if="scope.row.jsfs===2">自动支付</span>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.zt===1">正常</span>
                  <span v-if="scope.row.zt===2">欠费</span>
                  <span v-if="scope.row.zt===3">超期</span>
                  <span v-if="scope.row.zt===4">关闭</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.zt===1" type="text">续费</el-button>
                  <el-button v-if="scope.row.zt===2" type="text">支付账单</el-button>
                  <el-button v-if="scope.row.zt===3" type="text">删除</el-button>
                  <el-button v-if="scope.row.zt===4" type="text">关闭</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align: right;">
              <el-pagination
                :current-page="currentPage4_dd"
                :page-sizes="[1, 5,10, 15, 20]"
                :page-size="pagesize_dd"
                :total="tableData_dd.length"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange_dd"
                @current-change="handleCurrentChange_dd"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane :lazy="true" label="开票">
            <el-card
              class="box-card"
              style="width: 370px;height: 320px;float: left;margin-right: 5px"
              shadow="hover"
            >
              <div slot="header" class="clearfix">
                <span>消费概览（按产品）</span>
              </div>
              <pie-a :style="style_pic" :class="chart"/>
              <div style="width: 400px;text-align: center;margin-top: -26px;">消费总计：￥123782.0</div>
            </el-card>
            <el-card class="box-card" style="width: 750px;height: 320px;" shadow="hover">
              <div slot="header" class="clearfix">
                <span>2018年12月交易总览</span>
              </div>
              <el-card
                class="box-card"
                style="width: 370px;height: 265px;float: left;margin-left: 10px;margin-right: 10px"
                shadow="hover"
              >
                <div slot="header" class="clearfix">
                  <span>消费汇总</span>
                </div>
                <div>
                  <el-form ref="form" label-width="150px" style="margin-top: 10px">
                    <el-form-item label="消费总计：" class="form_ite">
                      <span>￥2131.04</span>
                    </el-form-item>
                    <el-form-item label="欠费金额：" class="form_ite">
                      <span>￥23</span>
                    </el-form-item>
                    <el-form-item label="实时支付：" class="form_ite">
                      <span>￥1230.99</span>
                    </el-form-item>
                    <el-form-item label="银行划扣：" class="form_ite">
                      <span>￥234</span>
                    </el-form-item>
                    <el-form-item label="充值账户划扣：" class="form_ite">
                      <span>￥1230</span>
                    </el-form-item>
                  </el-form>
                </div>
              </el-card>
              <el-card
                class="box-card"
                style="width: 350px;height: 265px;margin:10px"
                shadow="hover"
              >
                <div slot="header" class="clearfix">
                  <span>发票开具</span>
                  <el-button style="float: right; padding: 3px 0" type="text" @click="kfp">开发票</el-button>
                </div>
                <el-form ref="form" label-width="200px" style="margin-top: 60px">
                  <el-form-item label="未开发票金额：" class="form_ite">
                    <span>￥298334.34</span>
                  </el-form-item>
                  <el-form-item label="已开发票金额：" class="form_ite">
                    <span>￥23432.23</span>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-card>
            <el-table
              :data="tableData_fp.slice((currentPage4_fp - 1) * pagesize_fp, currentPage4_fp * pagesize_fp)"
              stripe
              height="220"
              size="mini"
              highlight-current-row
              style="width: 100%"
            >
              <el-table-column type="index" label="序号" width="80"/>
              <el-table-column prop="fphm" label="发票号码" show-overflow-tooltip/>
              <el-table-column prop="fptt" label="发票抬头" show-overflow-tooltip/>
              <el-table-column prop="money" label="金额"/>
              <el-table-column prop="data" label="开票日期"/>
              <el-table-column prop="zt" label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.zt===1">申请中</span>
                  <span v-if="scope.row.zt===2">开票中</span>
                  <span v-if="scope.row.zt===3">已开票</span>
                  <span v-if="scope.row.zt===4">已寄送</span>
                  <span v-if="scope.row.zt===5">已作废</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="95">
                <template slot-scope="scope">
                  <el-button type="text" @click="chakan_fp(scope.row)">查看</el-button>|
                  <el-button type="text" style="margin-left: 0px">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align: right;">
              <el-pagination
                :current-page="currentPage4_fp"
                :page-sizes="[1, 5,10, 15, 20]"
                :page-size="pagesize_fp"
                :total="tableData_fp.length"
                style="margin-top: 9px;margin-bottom: -4px"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange_fp"
                @current-change="handleCurrentChange_fp"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small">保 存</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 用户联系信息页面 -->
    <div>
      <el-dialog :visible.sync="dialogVisible_lxxx" :show-close="false" top="250px" width="40%">
        <el-card
          class="box-card"
          style="margin-top: -60px;margin-left: -20px;margin-right: -20px;margin-bottom: -30px"
        >
          <div slot="header" class="clearfix">
            <span style="font-size: 14px;font-weight: bold;">用户联系信息</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="dialogVisible_lxxx=false"
            >
              <i class="iconfont">&#xe638;</i>
            </el-button>
          </div>
          <table class="mailTable" width="100%">
            <tr>
              <td class="column">{{ tableData7[0].key }}</td>
              <td class="column2" style="width:180px">{{ tableData7[0].value }}</td>
              <td class="column">{{ tableData7[1].key }}</td>
              <td class="column2" style="width:242px">{{ tableData7[1].value }}</td>
            </tr>
            <tr>
              <td class="column">{{ tableData7[2].key }}</td>
              <td class="column2">{{ tableData7[2].value }}</td>
              <td class="column">{{ tableData7[3].key }}</td>
              <td class="column2">{{ tableData7[3].value }}</td>
            </tr>
          </table>
        </el-card>
      </el-dialog>
    </div>
    <!-- 合同详情 -->
    <div>
      <el-dialog
        :visible.sync="dialogVisible_ht"
        :before-close="handleClose_ht"
        top="20px"
        width="1200px"
      >
        <el-card class="box-card" shadow="hover" style="height: 218px;margin-top: -22px">
          <div slot="header" class="clearfix">
            <span style="font-size: 14px;font-weight:bold;">合同信息</span>
            <el-button
              v-if="show_button"
              style="float: right; padding: 3px 0"
              type="text"
              @click="updata_htxx"
            >修改</el-button>
            <el-button
              v-if="!show_button"
              style="float: right; padding: 3px 0"
              type="text"
              @click="add_htxx"
            >保存</el-button>
          </div>
          <table class="mailTable" width="100%">
            <tr>
              <td class="column">{{ tableData3[0].key }}</td>
              <td class="column2" style="width:180px">
                <span v-if="show_td">{{ tableData3[0].value }}</span>
                <el-input v-if="!show_td" v-model="tableData3[0].value" clearable size="mini"/>
              </td>
              <td class="column">{{ tableData3[1].key }}</td>
              <td class="column2" style="width:242px">
                <span v-if="show_td">{{ tableData3[1].value }}</span>
                <el-input v-if="!show_td" v-model="tableData3[1].value" clearable size="mini"/>
              </td>
              <td class="column">{{ tableData3[2].key }}</td>
              <td class="column2" style="width:240px">
                <span v-if="show_td">{{ tableData3[2].value }}</span>
                <el-input v-if="!show_td" v-model="tableData3[2].value" clearable size="mini"/>
              </td>
            </tr>
            <tr>
              <td class="column">{{ tableData3[3].key }}</td>
              <td class="column2">
                <span v-if="show_td">{{ tableData3[3].value }}</span>
                <el-input v-if="!show_td" v-model="tableData3[3].value" clearable size="mini"/>
              </td>
              <td class="column">{{ tableData3[4].key }}</td>
              <td class="column2">
                <span v-if="show_td">{{ tableData3[4].value }}</span>
                <el-input v-if="!show_td" v-model="tableData3[4].value" clearable size="mini"/>
              </td>
              <td class="column">{{ tableData3[5].key }}</td>
              <td class="column2">
                <span v-if="show_td">{{ tableData3[5].value }}</span>
                <el-input v-if="!show_td" v-model="tableData3[5].value" clearable size="mini"/>
              </td>
            </tr>
            <tr>
              <td class="column">{{ tableData3[7].key }}</td>
              <td class="column2" style="width:180px">
                <span v-if="show_td">{{ tableData3[7].value }}</span>
                <el-input v-if="!show_td" v-model="tableData3[7].value" clearable size="mini"/>
              </td>
              <td class="column">{{ tableData3[8].key }}</td>
              <td class="column2" style="width:240px">
                <span v-if="show_td">{{ tableData3[8].value }}</span>
                <el-input v-if="!show_td" v-model="tableData3[8].value" clearable size="mini"/>
              </td>
              <td class="column">{{ tableData3[9].key }}</td>
              <td class="column2" style="width:240px">
                <span v-if="show_td">{{ tableData3[9].value }}</span>
                <el-input v-if="!show_td" v-model="tableData3[9].value" clearable size="mini"/>
              </td>
            </tr>
            <tr>
              <td class="column">{{ tableData3[10].key }}</td>
              <td class="column2">
                <span v-if="show_td">{{ tableData3[10].value }}</span>
                <el-input v-if="!show_td" v-model="tableData3[10].value" clearable size="mini"/>
              </td>
              <td class="column">{{ tableData3[11].key }}</td>
              <td class="column2">
                <span v-if="show_td">{{ tableData3[11].value }}</span>
                <el-input v-if="!show_td" v-model="tableData3[11].value" clearable size="mini"/>
              </td>
              <td class="column">{{ tableData3[12].key }}</td>
              <td class="column2">
                <span v-if="show_td">{{ tableData3[12].value }}</span>
                <el-input v-if="!show_td" v-model="tableData3[12].value" clearable size="mini"/>
              </td>
            </tr>
            <tr>
              <td class="column3">{{ tableData3[6].key }}</td>
              <td class="column4" colspan="5">
                <span v-if="show_td">{{ tableData3[6].value }}</span>
                <el-input
                  v-if="!show_td"
                  v-model="tableData3[6].value"
                  type="textarea"
                  clearable
                  size="medium"
                />
              </td>
            </tr>
          </table>
        </el-card>
        <el-card
          class="box-card"
          style="width: 550px;float: left;margin-top: 3px;margin-right: 10px;"
          shadow="hover"
        >
          <div slot="header" class="clearfix">
            <span style="font-size: 14px;font-weight:bold;">合同收入概览</span>
          </div>
          <pie/>
          <div
            style="text-align: center;height: 8px;margin-top: -48px;margin-bottom: 7px"
          >实现收入：￥100000.25</div>
        </el-card>
        <el-card
          class="box-card"
          style="width: 600px;margin-top: 3px;height: 252px;"
          shadow="hover"
        >
          <div slot="header" class="clearfix">
            <span style="font-size: 14px;font-weight:bold;">合同电子件</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="dialogFormVisible_htdzj=true"
            >添加</el-button>
          </div>
          <el-table
            :data="tableData_dzht"
            :show-header="false"
            :default-sort="{prop: 'date', order: 'descending'}"
            size="mini"
            row-key="id"
            highlight-current-row
            tooltip-effect="dark"
            fit
            stripe
            height="240"
            style="width: 100%"
          >
            <el-table-column width="550" prop="htbh">
              <template slot-scope="scope">
                <span>{{ scope.row.htbh }}</span>-
                <span>{{ scope.$index+1 }}</span>
              </template>
            </el-table-column>
            <el-table-column width="30" align="left">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click.native.prevent="deleteRow_htbh(scope.$index, tableData_dzht)"
                >
                  <i class="iconfont">&#xe638;</i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card class="box-card" shadow="hover" style="margin-top: 3px">
          <el-table :data="tableData_ht_dd" style="width: 100%" size="mini" max-height="133">
            <el-table-column type="index" label="序号" width="80"/>
            <el-table-column label="订单编号" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.zt!==4"
                  type="text"
                  @click="dialogVisible_ddxq=true"
                >{{ scope.row.ddbh }}</el-button>
                <span v-if="scope.row.zt===4">{{ scope.row.ddbh }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="yxq" label="有效期" show-overflow-tooltip/>
            <el-table-column label="计费周期" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.jfzq===1">年</span>
                <span v-if="scope.row.jfzq===2">季</span>
                <span v-if="scope.row.jfzq===3">月</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="欠费金额" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button v-if="scope.row.zt!==4" type="text">{{ scope.row.qfje }}</el-button>
                <span v-if="scope.row.zt===4">{{ scope.row.qfje }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结算方式" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.jsfs===1">手动支付</span>
                <span v-if="scope.row.jsfs===2">自动支付</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.zt===1">正常</span>
                <span v-if="scope.row.zt===2">欠费</span>
                <span v-if="scope.row.zt===3">超期</span>
                <span v-if="scope.row.zt===4">关闭</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button v-if="scope.row.zt===1" type="text">续费</el-button>
                <el-button v-if="scope.row.zt===2" type="text">账单支付</el-button>
                <el-button
                  v-if="scope.row.zt===3"
                  type="text"
                  @click.native.prevent="deleteRow(scope.$index, tableData_ht_dd)"
                >删 除</el-button>
                <el-button v-if="scope.row.zt===4" type="text"/>
                <span v-if="scope.row.zt!==4">|</span>
                <el-button v-if="scope.row.zt!==4" type="text" @click="htdd_gb(scope.row)">关闭</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card class="box-card" style="margin-top: 3px;margin-bottom: -25px;" shadow="hover">
          <el-input v-model="input_4" style="width: 200px;margin-left: 10px;margin-top: 5px;">
            <template slot="prepend">审核结果:</template>
          </el-input>
          <br>
          <el-input v-model="input3" style="width: 1140px;margin-top: 5px;margin-left: 10px;">
            <template slot="prepend">审核意见:</template>
          </el-input>
          <br>
          <el-input
            v-model="input3"
            style="width: 250px;margin-left: 615px;margin-top: 22px;margin-bottom: 5px;"
          >
            <template slot="prepend">审核人:</template>
          </el-input>
          <el-input
            v-model="input3"
            style="width: 250px;margin-left: 30px;margin-top: 22px;margin-bottom: 5px;"
          >
            <template slot="prepend">审核日期:</template>
          </el-input>
        </el-card>
      </el-dialog>
    </div>
    <!-- 实名认证界面 -->
    <div>
      <el-dialog :visible.sync="dialogFormVisible_2" title="客户名称:广东瑞芬纸业有限公司" width="20%">
        <div style="margin-left: 15px;margin-top: -30px">
          <h3>营业执照</h3>
          <div>
            <el-upload
              ref="upload1"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-error="error_upload"
              :on-success="sus_upload"
              :file-list="fileList"
              :auto-upload="false"
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button
                style="margin-left: 10px;"
                size="small"
                type="success"
                @click="submitUpload1"
              >上传到服务器</el-button>
            </el-upload>
          </div>
          <h3>法人身份证</h3>
          <div>
            <el-upload
              ref="upload2"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-error="error_upload"
              :on-success="sus_upload"
              :file-list="fileList"
              :auto-upload="false"
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button
                style="margin-left: 10px;"
                size="small"
                type="success"
                @click="submitUpload2"
              >上传到服务器</el-button>
            </el-upload>
          </div>
          <h3>法人手持身份证照</h3>
          <div>
            <el-upload
              ref="upload3"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-error="error_upload"
              :on-success="sus_upload"
              :file-list="fileList"
              :auto-upload="false"
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button
                style="margin-left: 10px;"
                size="small"
                type="success"
                @click="submitUpload3"
              >上传到服务器</el-button>
            </el-upload>
          </div>
        </div>
        <!-- <div style="text-align: right;margin-top: 20px;margin-bottom: -20px"><span style='color: red'>* </span><span style="font-size: 10px">只能上传jpg文件，且不超过2MB</span></div> -->
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogFormVisible_2=false">取 消</el-button>
          <el-button type="primary" size="mini" @click="dialogFormVisible_2=false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 合同电子件上传 -->
    <div>
      <el-dialog :visible.sync="dialogFormVisible_htdzj" width="20%">
        <el-upload
          ref="upload1"
          :on-error="error_upload"
          :on-success="sus_upload"
          :auto-upload="false"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload1"
          >上传到服务器</el-button>
        </el-upload>
      </el-dialog>
    </div>
    <!-- 订单界面 -->
    <div>
      <el-dialog :visible.sync="dialogVisible_dd" width="50%">
        <div>
          <el-input
            v-model="input_dd"
            placeholder="请输入客户名称/客户编号"
            style="width: 230px;float: left;"
            size="small"
          />
          <el-popover placement="bottom" width="490" trigger="click">
            <el-button
              slot="reference"
              style="margin-left: -1px;height: 32px;background-color:#F0F0F0"
              size="small"
            >
              <i class="iconfont">&#xe64a;</i>
            </el-button>
            <el-form ref="form" :model="form_1" label-width="100px" label-position="left">
              <el-form-item label="商品名称">
                <el-input v-model="form_1.code" size="mini" clearable/>
              </el-form-item>
              <el-form-item label="有效期" style="margin-top: -15px">
                <el-date-picker
                  v-model="form_1.value"
                  :picker-options="pickerOptions2"
                  size="mini"
                  type="daterange"
                  align="right"
                  value-format="yyyyMMdd"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="订单编号" style="margin-top: -15px">
                <el-input v-model="form_1.name" size="mini" clearable/>
              </el-form-item>
              <el-form-item style="text-align: right;margin-top: -18px;margin-bottom: -15px">
                <el-button type="primary" size="mini" @click="zy_sx">查找</el-button>
              </el-form-item>
            </el-form>
          </el-popover>
        </div>
        <el-table :data="tables_dd" size="mini" stripe height="305" style="width: 100%">
          <el-table-column type="index" label="序号" width="80"/>
          <el-table-column label="订单编号">
            <template slot-scope="scope">
              <el-button type="text" @click="dialogVisible_dds">{{ scope.row.ddbh }}</el-button>
            </template>
          </el-table-column>
          <el-table-column sortable prop="spmc" label="商品名称"/>
          <el-table-column prop="yxq" label="有效期"/>
          <el-table-column label="计费周期">
            <template slot-scope="scope">
              <span v-if="scope.row.jfzq===1">年</span>
              <span v-if="scope.row.jfzq===2">月</span>
              <span v-if="scope.row.jfzq===3">季</span>
            </template>
          </el-table-column>
          <el-table-column label="欠费金额">
            <template slot-scope="scope">
              <el-button type="text">{{ scope.row.qfje }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="结算方式">
            <template slot-scope="scope">
              <span v-if="scope.row.jsfs===1">手动支付</span>
              <span v-if="scope.row.jsfs===2">自动支付</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.zt===1">正常</span>
              <span v-if="scope.row.zt===2">欠费</span>
              <span v-if="scope.row.zt===3">超期</span>
              <span v-if="scope.row.zt===4">关闭</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.zt===1" type="text">续费</el-button>
              <el-button v-if="scope.row.zt===2" type="text">支付账单</el-button>
              <el-button v-if="scope.row.zt===3" type="text">删除</el-button>
              <el-button v-if="scope.row.zt===4" type="text">关闭</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: right;">
          <el-pagination
            :current-page="currentPage4_dd"
            :page-sizes="[1, 5,10, 15, 20]"
            :page-size="pagesize_dd"
            :total="tableData_dd.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange_dd"
            @current-change="handleCurrentChange_dd"
          />
        </div>
      </el-dialog>
    </div>
    <!-- 订单详情页 -->
    <div>
      <el-dialog
        :visible.sync="dialogVisible_ddxq"
        :before-close="handleClose_ddxq"
        top="20px"
        width="1200px"
      >
        <el-card class="box-card" shadow="hover" style="height: 190px;margin-top: -20px">
          <div slot="header" class="clearfix">
            <span style="font-size: 14px;font-weight:bold;">订单信息</span>
            <el-button
              v-if="show_button_dd"
              style="float: right; padding: 3px 0"
              type="text"
              @click="updata_ddxq"
            >修改</el-button>
            <el-button
              v-if="!show_button_dd"
              style="float: right; padding: 3px 0"
              type="text"
              @click="add_ddxq"
            >保存</el-button>
          </div>
          <table class="mailTable" width="100%">
            <tr>
              <td class="column">{{ tableData4[0].key }}</td>
              <td class="column2" style="width:180px">
                <span v-if="show_td_dd">{{ tableData4[0].value }}</span>
                <el-input v-if="!show_td_dd" v-model="tableData4[0].value" clearable size="mini"/>
              </td>
              <td class="column">{{ tableData4[1].key }}</td>
              <td class="column2" style="width:242px">
                <span v-if="show_td_dd">{{ tableData4[1].value }}</span>
                <el-input v-if="!show_td_dd" v-model="tableData4[1].value" clearable size="mini"/>
              </td>
              <td class="column">{{ tableData4[2].key }}</td>
              <td class="column2" style="width:240px">
                <span v-if="show_td_dd">{{ tableData4[2].value }}</span>
                <el-input v-if="!show_td_dd" v-model="tableData4[2].value" clearable size="mini"/>
              </td>
            </tr>
            <tr>
              <td class="column">{{ tableData4[3].key }}</td>
              <td class="column2">
                <span v-if="show_td_dd">{{ tableData4[3].value }}</span>
                <el-input v-if="!show_td_dd" v-model="tableData4[3].value" clearable size="mini"/>
              </td>
              <td class="column">{{ tableData4[4].key }}</td>
              <td class="column2">
                <span v-if="show_td_dd">{{ tableData4[4].value }}</span>
                <el-input v-if="!show_td_dd" v-model="tableData4[4].value" clearable size="mini"/>
              </td>
              <td class="column">{{ tableData4[5].key }}</td>
              <td class="column2">
                <span v-if="show_td_dd">{{ tableData4[5].value }}</span>
                <el-input v-if="!show_td_dd" v-model="tableData4[5].value" clearable size="mini"/>
              </td>
            </tr>
            <tr>
              <td class="column">{{ tableData4[6].key }}</td>
              <td class="column2">
                <span v-if="show_td_dd">{{ tableData4[6].value }}</span>
                <el-input v-if="!show_td_dd" v-model="tableData4[6].value" clearable size="mini"/>
              </td>
              <td class="column">{{ tableData4[7].key }}</td>
              <td class="column2" style="width:180px">
                <span v-if="show_td_dd">{{ tableData4[7].value }}</span>
                <el-input v-if="!show_td_dd" v-model="tableData4[7].value" clearable size="mini"/>
              </td>
            </tr>
            <tr>
              <td class="column3">{{ tableData4[8].key }}</td>
              <td class="column4" colspan="5">
                <span v-if="show_td_dd">{{ tableData4[8].value }}</span>
                <el-input
                  v-if="!show_td_dd"
                  v-model="tableData4[8].value"
                  type="textarea"
                  clearable
                  size="medium"
                />
              </td>
            </tr>
          </table>
        </el-card>
        <el-card
          class="box-card"
          style="width: 550px;float: left;margin-top: 3px;margin-right: 10px;"
          shadow="hover"
        >
          <div slot="header" class="clearfix">
            <span style="font-size: 14px;font-weight:bold;">订单收入概览</span>
          </div>
          <div style="text-align: center;height: 60px;margin-top: 25px;margin-bottom: -20px">
            实现收入：￥
            <span style="font-size: 13;color:#3478d9">100000.25</span> 当前欠费：￥
            <span style="font-size: 13;color:#3478d9">1000</span>
          </div>
        </el-card>
        <el-card class="box-card" shadow="hover" style="height: 100px;margin-top: 3px">
          <div slot="header" class="clearfix">
            <span style="font-size: 14px;font-weight:bold;">计费规则</span>
            <el-button
              v-if="show_button_jfgz"
              style="float: right; padding: 3px 0"
              type="text"
              @click="updata_jfgz"
            >修改</el-button>
            <el-button
              v-if="!show_button_jfgz"
              style="float: right; padding: 3px 0"
              type="text"
              @click="add_jfgz"
            >保存</el-button>
          </div>
          <table class="mailTable" width="100%">
            <tr>
              <td class="column">{{ tableData5[0].key }}</td>
              <td class="column2" style="width:180px">
                <span v-if="show_td_jfgz">{{ tableData5[0].value }}</span>
                <!-- <el-input v-model="tableData5[0].value" clearable size="mini" v-if="!show_td_jfgz"></el-input> -->
                <el-select
                  v-if="!show_td_jfgz"
                  v-model="tableData5[0].value"
                  placeholder="请选择"
                  clearable
                  size="mini"
                >
                  <el-option
                    v-for="item in options_jfgz"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </td>
              <td class="column">{{ tableData5[1].key }}</td>
              <td class="column2" style="width:242px">
                <span v-if="show_td_jfgz">￥{{ tableData5[1].value }}</span>
                <el-input
                  v-if="!show_td_jfgz"
                  v-model="tableData5[1].value"
                  clearable
                  size="mini"
                  @input="dj_change"
                />
              </td>
            </tr>
            <tr>
              <td class="column">{{ tableData5[2].key }}</td>
              <td class="column2">
                <span v-if="show_td_jfgz">{{ tableData5[2].value }}%</span>
                <el-input
                  v-if="!show_td_jfgz"
                  v-model="tableData5[2].value"
                  clearable
                  size="mini"
                  @input="dj_change1"
                />
              </td>
              <td class="column">{{ tableData5[3].key }}</td>
              <td class="column2">
                <span v-if="show_td_jfgz">￥{{ tableData5[3].value }}</span>
                <el-input
                  v-if="!show_td_jfgz"
                  v-model="tableData5[3].value"
                  :disabled="true"
                  clearable
                  size="mini"
                />
              </td>
            </tr>
          </table>
        </el-card>
        <el-card class="box-card" shadow="hover" style="margin-top: 3px">
          <div slot="header" class="clearfix">
            <span style="font-size: 14px;font-weight:bold;">账单列表</span>
          </div>
          <div style="width: 300px;float: left;margin-top: 13px;margin-bottom: 5px">
            <el-input
              v-model="input_zdlb"
              style="width: 150px;float: left;margin-left: 6px"
              size="small"
            />
            <el-popover placement="bottom" width="320" trigger="click">
              <el-button
                slot="reference"
                style="margin-left: -1px;height: 32px;background-color:#F0F0F0"
                size="small"
              >
                <i class="iconfont">&#xe64a;</i>
              </el-button>
              <el-form ref="form" :model="form_1" label-width="100px" label-position="left">
                <el-form-item label="账单编号">
                  <el-input v-model="from_zd.code" size="mini" clearable/>
                </el-form-item>
                <el-form-item label="费用期间" style="margin-top: -15px">
                  <el-date-picker
                    v-model="from_zd.fyqj"
                    size="mini"
                    style="width:194px"
                    type="month"
                    format="yyyy年MM月"
                    value-format="yyyyMM"
                    placeholder="选择月"
                  />
                </el-form-item>
                <el-form-item label="支付方式" style="margin-top: -15px">
                  <el-input v-model="from_zd.zffs" size="mini" clearable/>
                </el-form-item>
                <el-form-item style="text-align: right;margin-top: -18px;margin-bottom: -15px">
                  <el-button type="primary" size="mini" @click="zdlb">查找</el-button>
                </el-form-item>
              </el-form>
            </el-popover>
          </div>
          <el-table :data="tables_zdlb" stripe style="width: 100%" height="280px" size="mini">
            <el-table-column type="index" label="序号" width="80"/>
            <el-table-column label="账单编号" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" @click="zdmx_open(scope.row)">{{ scope.row.zdbh }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="fyqj" label="费用期间" show-overflow-tooltip/>
            <el-table-column prop="money" label="金额" show-overflow-tooltip/>
            <el-table-column label="支付状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.zfzt===1">未支付</span>
                <span v-if="scope.row.zfzt===2">已支付</span>
              </template>
            </el-table-column>
            <el-table-column label="支付方式" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.zffs===1">银行划扣</span>
                <span v-if="scope.row.zffs===2">充值账户扣缴</span>
                <span v-if="scope.row.zffs===3">在线支付</span>
                <span v-if="scope.row.zffs===4">现金支付</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button v-if="scope.row.zfzt===1" type="text" @click="zd_zf(scope.row)">支 付</el-button>
                <el-button v-if="scope.row.zfzt===2" type="text" style="margin-left:0px">发 票</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="float: left;margin-top: 7px">
            <span style="font-size: 14;margin-left: 5px">合计：</span>
            <span style="font-size: 13;color:#3478d9">{{ tableData_zdlb.length }}</span>
            <span style="font-size: 14">张账单</span>
            <span style="font-size: 14;margin-left: 10px">总金额：￥</span>
            <span style="font-size: 13;color:#3478d9">32423767</span>
            <span style="font-size: 14;margin-left: 10px">欠费金额：￥</span>
            <span style="font-size: 13;color:#3478d9">32342</span>
          </div>
          <div style="text-align: right;">
            <el-pagination
              :current-page="currentPage4_zdlb"
              :page-sizes="[1, 5,10, 15, 20]"
              :page-size="pagesize_zdlb"
              :total="tableData_zdlb.length"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange_zdlb"
              @current-change="handleCurrentChange_zdlb"
            />
          </div>
        </el-card>
      </el-dialog>
    </div>
    <!-- 账单明细页 -->
    <div>
      <el-dialog :visible.sync="dialogVisible_zdmx" width="60%">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button style="float: right; padding: 3px 0" type="text">支付</el-button>
          </div>
          <table class="mailTable" width="100%">
            <tr>
              <td class="column">{{ tableData6[0].key }}</td>
              <td class="column2" style="width:180px">{{ tableData6[0].value }}</td>
              <td class="column">{{ tableData6[1].key }}</td>
              <td class="column2" style="width:242px">{{ tableData6[1].value }}</td>
              <td class="column">{{ tableData6[2].key }}</td>
              <td class="column2" style="width:240px">
                <el-button type="text" @click="dialogVisible_zdmx=false">{{ tableData6[2].value }}</el-button>
              </td>
            </tr>
            <tr>
              <td class="column">{{ tableData6[3].key }}</td>
              <td class="column2">
                <span v-if="tableData6[3].value===1">未支付</span>
                <span v-if="tableData6[3].value===2">已支付</span>
              </td>
              <td class="column">{{ tableData6[4].key }}</td>
              <td class="column2">{{ tableData6[4].value }}</td>
              <td class="column">{{ tableData6[5].key }}</td>
              <td class="column2">
                <span v-if="tableData6[5].value===1">银行划扣</span>
                <span v-if="tableData6[5].value===2">充值账户扣缴</span>
                <span v-if="tableData6[5].value===3">在线支付</span>
                <span v-if="tableData6[5].value===4">现金支付</span>
              </td>
            </tr>
          </table>
          <el-table :data="tableData_zdmx" stripe size="mini" height="200" style="width: 100%">
            <el-table-column type="index" label="序号" width="80"/>
            <el-table-column prop="name" label="费用名称"/>
            <el-table-column prop="money" width="120px" label="金额(元)"/>
          </el-table>
          <el-table
            :show-header="false"
            :data="tableData_zdmx_1"
            size="mini"
            height="110"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="name"/>
            <el-table-column width="120px" prop="money"/>
          </el-table>
        </el-card>
      </el-dialog>
    </div>
    <!-- 发票申请页 -->
    <div>
      <el-dialog :visible.sync="dialogVisible_fpsq" width="600px">
        <el-card class="box-card" style="width: 555px;margin-bottom: 15px">
          <div slot="header" class="clearfix">
            <span>开票申请</span>
          </div>
          <table class="mailTable" width="100%">
            <tr>
              <td class="column">{{ tableData_kpsq[0].key }}</td>
              <td class="column2" style="width:180px">
                <el-select
                  v-model="value_kpsq"
                  placeholder="请选择"
                  size="mini"
                  style="width: 240px"
                  @change="fplx_change"
                >
                  <el-option
                    v-for="item in options_kpsq"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="column">{{ tableData_kpsq[1].key }}</td>
              <td class="column2" style="width:152px">
                <el-input v-model="tableData_kpsq[1].value" clearable size="mini"/>
              </td>
            </tr>
            <tr>
              <td class="column">{{ tableData_kpsq[2].key }}</td>
              <td class="column2" style="width:240px">
                <el-select
                  ref="select_ref"
                  v-model="value_kpsq_tt"
                  placeholder="请选择"
                  size="mini"
                  style="width: 240px"
                >
                  <el-option
                    v-for="item in options_kpsq_tt"
                    :disabled="item.disabled"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                    sizi="mini"
                  />
                  <template>
                    <div
                      style="width:240px;"
                      class="addButten"
                      onmouseover="this.style.backgroundColor='#f8f8f8';this.style.color='#3478d9'"
                      onmouseout="this.style.backgroundColor='#fff';this.style.color='black'"
                      @click="add_select"
                    >
                      <div style="height: 4px"/>
                      <i class="el-icon-circle-plus-outline"/>
                      新增
                    </div>
                  </template>
                </el-select>
              </td>
            </tr>
          </table>
        </el-card>
        <el-card v-if="show_xzfptt" class="box-card" style="margin-top: 20px;width: 555px">
          <div slot="header" class="clearfix">
            <span>新增发票抬头</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="save_fptt">保存</el-button>
          </div>
          <el-input v-model="input3_gsqc" placeholder="请输入公司全称" style="margin-bottom: 5px"/>
          <el-input v-model="input3_nsrsbh" placeholder="请输入纳税人识别号 " style="margin-bottom: 5px"/>
          <el-input v-model="input3_khyh" placeholder="请输入公司开户银行 " v/>
          <el-input v-model="input3_yhzh" placeholder="请输入银行账号" style="margin-bottom: 5px"/>
          <el-input v-model="input3_dzdh" placeholder="请输入经营地址、电话" style="margin-bottom: 5px"/>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button v-show="tj_show" type="primary" size="mini" @click="dis_kpsq">提 交</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 查看发票 防伪税控增值税专用发票 -->
    <div>
      <el-dialog :visible.sync="dialogVisible_ckfp" width="1100px">
        <div>
          <span
            style="font-weight:bold ;text-decoration:underline;color: #A00000;font-size: 17px;margin-left: 440px;margin-right: 268px"
          >防伪税控增值税专用发票</span>
          <span style="color: #A00000;">*</span>
          <span>
            发票号码:
            <span>4400134001</span>
          </span>
          <br>
          <span style="margin-left: 899px;display:block;margin-top: 12px;margin-bottom: -1px">
            <span style="color: #A00000;">*</span>
            <span>
              发票代码:
              <span>01198260</span>
            </span>
          </span>
          <br>
          <span style="margin-left: 908px">
            开票日期:
            <span>2018-02-02</span>
          </span>
        </div>
        <div>
          <table class="mailTable" style="margin-top: 8px" width="100%">
            <tr>
              <td class="column" rowspan="4">
                <span style="width: 4px;display:block;margin-left: 20px">
                  <span>购</span>
                  <br>
                  <span style="margin-top: 15px;margin-bottom: 5px;display:block;">买</span>
                  <br>
                  <span>方</span>
                  <br>
                </span>
              </td>
              <td class="column" style="width: 130px;text-align: right;">名称</td>
              <td class="column2" style="text-align: left;" colspan="5">蓝思科技（长沙）有限公司</td>
              <td class="column" rowspan="4" style="width: 60px">
                <span style="width: 4px;display:block;margin-left: 20px">
                  <span>密</span>
                  <br>
                  <span style="margin-top: 15px;margin-bottom: 5px;display:block;">码</span>
                  <br>
                  <span>区</span>
                  <br>
                </span>
              </td>
              <td class="column2" colspan="5" rowspan="4"/>
            </tr>
            <tr>
              <td class="column" style="width: 130px;text-align: right;">纳税人识别号</td>
              <td class="column2" style="text-align: left;" colspan="5">1381237613618738E</td>
            </tr>
            <tr>
              <td class="column" style="width: 130px;text-align: right;">地址,电话</td>
              <td class="column2" style="text-align: left;" colspan="5">湖南长沙经济开发区莆田路99号</td>
            </tr>
            <tr>
              <td class="column" style="width: 130px;text-align: right;">开户行及账号</td>
              <td class="column2" style="text-align: left;" colspan="5">66698453</td>
            </tr>
            <tr>
              <td class="column" colspan="3" style="text-align: left;">货物或应税劳务,服务名称</td>
              <td class="column" style="text-align: left;">规格型号</td>
              <td class="column" style="text-align: left;">单位</td>
              <td class="column" style="text-align: left;">数量</td>
              <td class="column" colspan="3" style="width: 100px;text-align: right;">单价</td>
              <td class="column" style="text-align: right;">
                <span style="color:#A00000;">*</span>金额
              </td>
              <td class="column">
                <span style="color:#A00000; ">*</span>税率
              </td>
              <td class="column" style="text-align: right;">
                <span style="color:#A00000;">*</span>税额
              </td>
            </tr>
            <tr>
              <td class="column2" colspan="3" style="text-align: left;">*非金属矿物制品*P2粉</td>
              <td class="column2" style="text-align: left;">ZSF0019</td>
              <td class="column2" style="text-align: left;">CT</td>
              <td class="column2" style="text-align: left;">10000</td>
              <td class="column2" colspan="3" style="width: 100px;text-align: right;">8.1200</td>
              <td class="column2" style="text-align: right;">81200.00</td>
              <td class="column2">17%</td>
              <td class="column2" style="text-align: right;">13804.00</td>
            </tr>
            <tr>
              <td class="column2" colspan="3" style="text-align: left;"/>
              <td class="column2" style="text-align: left;"/>
              <td class="column2" style="text-align: left;"/>
              <td class="column2" style="text-align: left;"/>
              <td class="column2" colspan="3" style="width: 100px;text-align: right;"/>
              <td class="column2" style="text-align: right;"/>
              <td class="column2"/>
              <td class="column2" style="text-align: right;"/>
            </tr>
            <tr>
              <td class="column2" colspan="3" style="text-align: left;"/>
              <td class="column2" style="text-align: left;"/>
              <td class="column2" style="text-align: left;"/>
              <td class="column2" style="text-align: left;"/>
              <td class="column2" colspan="3" style="width: 100px;text-align: right;"/>
              <td class="column2" style="text-align: right;"/>
              <td class="column2"/>
              <td class="column2" style="text-align: right;"/>
            </tr>
            <tr>
              <td class="column" colspan="3" style="text-align: right;">合计</td>
              <td class="column2" colspan="6"/>
              <td class="column2" style="text-align: right;">81200.00</td>
              <td class="column2"/>
              <td class="column2" style="text-align: right;">13804.00</td>
            </tr>
            <tr>
              <td class="column" colspan="3" style="text-align: right;">价税合计（大写）</td>
              <td class="column2" colspan="6" style="text-align: right;">玖万伍千零肆圆整</td>
              <td class="column" style="text-align: right;">价税合计（小写）</td>
              <td class="column2" style="text-align: right;" colspan="2">95004.00</td>
            </tr>
            <tr>
              <td class="column" rowspan="4">
                <span style="width: 4px;display:block;margin-left: 20px">
                  <span>销</span>
                  <br>
                  <span style="margin-top: 15px;margin-bottom: 5px;display:block;">售</span>
                  <br>
                  <span>方</span>
                  <br>
                </span>
              </td>
              <td class="column" style="width: 130px;text-align: right;">名称</td>
              <td class="column2" style="text-align: left;" colspan="5">东莞市创科材料科技有限公司</td>
              <td class="column" rowspan="4" style="width: 60px">
                <span style="width: 4px;display:block;margin-left: 20px">
                  <span>备</span>
                  <br>
                  <span style="margin-top: 15px;margin-bottom: 5px;display:block;">注</span>
                  <br>
                </span>
              </td>
              <td class="column2" colspan="5" rowspan="4"/>
            </tr>
            <tr>
              <td class="column" style="width: 130px;text-align: right;">纳税人识别号</td>
              <td class="column2" style="text-align: left;" colspan="5">91442346264623476XH</td>
            </tr>
            <tr>
              <td class="column" style="width: 130px;text-align: right;">地址,电话</td>
              <td class="column2" style="text-align: left;" colspan="5"/>
            </tr>
            <tr>
              <td class="column" style="width: 130px;text-align: right;">开户行及账号</td>
              <td class="column2" style="text-align: left;" colspan="5">7699 0455 0000 608</td>
            </tr>
          </table>
        </div>
      </el-dialog>
    </div>
    <!-- 查看发票 防伪税控增值税专用发票 -->
    <div>
      <el-dialog :visible.sync="dialogVisible_ptfp" width="1100px">
        <div>
          <span
            style="font-weight:bold ;text-decoration:underline;color: #A00000;font-size: 17px;margin-left: 440px;margin-right: 268px"
          >防伪税控增值税普通发票</span>
          <span style="color: #A00000;">*</span>
          <span>
            发票代码:
            <span>4400134001</span>
          </span>
          <br>
          <span style="margin-left: 899px;display:block;margin-top: 12px;margin-bottom: -1px">
            <span style="color: #A00000;">*</span>
            <span>
              发票号码:
              <span>01198260</span>
            </span>
          </span>
          <br>
          <span style="margin-left: 908px">
            开票日期:
            <span>2018-02-02</span>
          </span>
        </div>
        <div>
          <table class="mailTable" style="margin-top: 8px" width="100%">
            <tr>
              <td class="column" rowspan="4">
                <span style="width: 4px;display:block;margin-left: 20px">
                  <span>购</span>
                  <br>
                  <span style="margin-top: 15px;margin-bottom: 5px;display:block;">买</span>
                  <br>
                  <span>方</span>
                  <br>
                </span>
              </td>
              <td class="column" colspan="2" style="width: 130px;text-align: right;">名称</td>
              <td class="column2" style="text-align: left;" colspan="6">蓝思科技（长沙）有限公司</td>
              <td class="column" colspan="2" rowspan="4" style="width: 60px">
                <span style="width: 4px;display:block;margin-left: 20px">
                  <span>密</span>
                  <br>
                  <span style="margin-top: 15px;margin-bottom: 5px;display:block;">码</span>
                  <br>
                  <span>区</span>
                  <br>
                </span>
              </td>
              <td class="column2" colspan="5" rowspan="4"/>
            </tr>
            <tr>
              <td class="column" colspan="2" style="width: 130px;text-align: right;">纳税人识别号</td>
              <td class="column2" style="text-align: left;" colspan="6">1381237613618738E</td>
            </tr>
            <tr>
              <td class="column" colspan="2" style="width: 130px;text-align: right;">地址,电话</td>
              <td class="column2" style="text-align: left;" colspan="6">湖南长沙经济开发区莆田路99号</td>
            </tr>
            <tr>
              <td class="column" colspan="2" style="width: 130px;text-align: right;">开户行及账号</td>
              <td class="column2" style="text-align: left;" colspan="6">66698453</td>
            </tr>
            <tr>
              <td class="column" colspan="2" style="text-align: left;">
                <span style="color:#A00000;">*</span>货物或应税劳务,服务名称
              </td>
              <td class="column" style="text-align: left;" colspan="2">规格型号</td>
              <td class="column" style="text-align: left;">单位</td>
              <td class="column" style="text-align: left;">数量</td>
              <td class="column" colspan="3" style="width: 100px;text-align: right;">单价</td>
              <td class="column" style="text-align: right;" colspan="2">
                <span style="color:#A00000;">*</span>金额
              </td>
              <td class="column" style="width: 98px;">
                <span style="color:#A00000; ">*</span>税率
              </td>
              <td class="column" colspan="2" style="text-align: right;">
                <span style="color:#A00000;">*</span>税额
              </td>
              <td class="column" style="text-align: right;width: 119px">
                <span style="color:#A00000;">*</span>货物类型
              </td>
              <td class="column" style="text-align: right;width: 119px">
                <span style="color:#A00000;">*</span>计税方式
              </td>
            </tr>
            <tr>
              <td class="column2" colspan="2" style="text-align: left;">*非金属矿物制品*P2粉</td>
              <td class="column2" style="text-align: left;" colspan="2">ZSF0019</td>
              <td class="column2" style="text-align: left;">CT</td>
              <td class="column2" style="text-align: left;">10000</td>
              <td class="column2" colspan="3" style="width: 100px;text-align: right;">8.1200</td>
              <td class="column2" style="text-align: right;" colspan="2">81200.00</td>
              <td class="column2" style="background-color: #3478d9">
                <el-select
                  v-model="value_sl_1"
                  style="width: 100px"
                  size="mini"
                  placeholder
                  filterable
                  allow-create
                  default-first-option
                  @change="change_sl_1"
                >
                  <el-option
                    v-for="item in options_sl"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </td>
              <td class="column2" colspan="2" style="text-align: right;">13804.00</td>
              <td class="column2" style="background-color: #3478d9">
                <el-select
                  v-model="value_hwlx_1"
                  style="width: 119px"
                  size="mini"
                  placeholder
                  filterable
                  allow-create
                  default-first-option
                >
                  <el-option
                    v-for="item in options_hwlx"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </td>
              <td class="column2" style="background-color: #3478d9">
                <el-select
                  v-model="value_jsfs_1"
                  style="width: 119px"
                  size="mini"
                  placeholder
                  filterable
                  allow-create
                  default-first-option
                >
                  <el-option
                    v-for="item in options_jsfs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="column2" colspan="2" style="text-align: left;"/>
              <td class="column2" style="text-align: left;" colspan="2"/>
              <td class="column2" style="text-align: left;"/>
              <td class="column2" style="text-align: left;"/>
              <td class="column2" colspan="3" style="width: 100px;text-align: right;"/>
              <td class="column2" style="text-align: right;" colspan="2"/>
              <td class="column2" style="background-color: #3478d9">
                <el-select
                  v-model="value_sl_2"
                  style="width: 100px"
                  size="mini"
                  placeholder
                  filterable
                  allow-create
                  default-first-option
                  @change="change_sl_2"
                >
                  <el-option
                    v-for="item in options_sl"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </td>
              <td class="column2" colspan="2" style="text-align: right;"/>
              <td class="column2" style="background-color: #3478d9">
                <el-select
                  v-model="value_hwlx_2"
                  style="width: 119px"
                  size="mini"
                  placeholder
                  filterable
                  allow-create
                  default-first-option
                >
                  <el-option
                    v-for="item in options_hwlx"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </td>
              <td class="column2" style="background-color: #3478d9">
                <el-select
                  v-model="value_jsfs_2"
                  style="width: 119px"
                  size="mini"
                  placeholder
                  filterable
                  allow-create
                  default-first-option
                >
                  <el-option
                    v-for="item in options_jsfs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="column2" colspan="2" style="text-align: left;"/>
              <td class="column2" style="text-align: left;" colspan="2"/>
              <td class="column2" style="text-align: left;"/>
              <td class="column2" style="text-align: left;"/>
              <td class="column2" colspan="3" style="width: 100px;text-align: right;"/>
              <td class="column2" style="text-align: right;" colspan="2"/>
              <td class="column2" style="background-color: #3478d9">
                <el-select
                  v-model="value_sl_3"
                  style="width: 100px"
                  placeholder
                  size="mini"
                  filterable
                  allow-create
                  default-first-option
                  @change="change_sl_3"
                >
                  <el-option
                    v-for="item in options_sl"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </td>
              <td class="column2" colspan="2" style="text-align: right;"/>
              <td class="column2" style="background-color: #3478d9">
                <el-select
                  v-model="value_hwlx_3"
                  style="width: 119px"
                  size="mini"
                  placeholder
                  filterable
                  allow-create
                  default-first-option
                >
                  <el-option
                    v-for="item in options_hwlx"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </td>
              <td class="column2" style="background-color: #3478d9">
                <el-select
                  v-model="value_jsfs_3"
                  style="width: 119px"
                  size="mini"
                  placeholder
                  filterable
                  allow-create
                  default-first-option
                >
                  <el-option
                    v-for="item in options_jsfs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="column" colspan="2" style="text-align: right;">合计</td>
              <td class="column2" colspan="7"/>
              <td class="column2" colspan="2" style="text-align: right;">81200.00</td>
              <td class="column2" colspan="2"/>
              <td class="column2" style="text-align: right;">13804.00</td>
              <td class="column2"/>
              <td class="column2"/>
            </tr>
            <tr>
              <td class="column" colspan="2" style="text-align: right;">价税合计（大写）</td>
              <td class="column2" colspan="7" style="text-align: right;">玖万伍千零肆圆整</td>
              <td class="column" style="text-align: right;" colspan="3">价税合计(小写)</td>
              <td class="column2" style="text-align: right;" colspan="4">95004.00</td>
            </tr>
            <tr>
              <td class="column" rowspan="4">
                <span style="width: 4px;display:block;margin-left: 20px">
                  <span>销</span>
                  <br>
                  <span style="margin-top: 15px;margin-bottom: 5px;display:block;">售</span>
                  <br>
                  <span>方</span>
                  <br>
                </span>
              </td>
              <td class="column" style="width: 130px;text-align: right;">名称</td>
              <td class="column2" style="text-align: left;" colspan="7">东莞市创科材料科技有限公司</td>
              <td class="column" rowspan="4" style="width: 60px">
                <span style="width: 4px;display:block;margin-left: 20px">
                  <span>备</span>
                  <br>
                  <span style="margin-top: 15px;margin-bottom: 5px;display:block;">注</span>
                  <br>
                </span>
              </td>
              <td class="column2" colspan="6" rowspan="4"/>
            </tr>
            <tr>
              <td class="column" style="width: 130px;text-align: right;">纳税人识别号</td>
              <td class="column2" style="text-align: left;" colspan="5">91442346264623476XH</td>
            </tr>
            <tr>
              <td class="column" style="width: 130px;text-align: right;">地址,电话</td>
              <td class="column2" style="text-align: left;" colspan="5"/>
            </tr>
            <tr>
              <td class="column" style="width: 130px;text-align: right;">开户行及账号</td>
              <td class="column2" style="text-align: left;" colspan="5">7699 0455 0000 608</td>
            </tr>
            <tr>
              <td class="column" colspan="4">即征即退标识</td>
              <td class="column2" colspan="6">
                <el-radio-group v-model="radio_jzjt">
                  <el-radio :label="1">否</el-radio>
                  <el-radio :label="2">是</el-radio>
                </el-radio-group>
              </td>
              <td class="column" colspan="4">作废标识</td>
              <td class="column2" colspan="2">
                <el-radio-group v-model="radio_zf">
                  <el-radio :label="3">否</el-radio>
                  <el-radio :label="4">是</el-radio>
                </el-radio-group>
              </td>
            </tr>
          </table>
        </div>
      </el-dialog>
    </div>
    <!-- 充值 -->
    <div>
      <el-dialog :visible.sync="dialogVisible_cz" width="450px">
        <div style="text-align: center;">
          <el-input
            v-model="input_cz"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            style="width: 190px;margin-right: 20px"
            placeholder="请输入充值金额"
          />
          <el-button
            circle
            type="primary"
            size="medium"
            style="height: 80px;width: 80px"
            @click="zf_click"
          >支付</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 支付 -->
    <div>
      <el-dialog :visible.sync="dialogVisible_zf" width="650px">
        <div style="text-align:left;font-size: 16px;margin-bottom: 12px">
          支付流水号：{{ sjs }}
          <span style="margin-left: 40px">
            应付金额
            <span style="color: red">{{ zf_val }}</span>元
          </span>
        </div>
        <el-tabs v-model="activeName2" type="card" stretch>
          <el-tab-pane label="微信" name="first">
            <div style="float:left;margin-right: 50px">
              <img src="./img/wx.jpg" style="width: 250px;height: 250px">
              <div style="width: 215px;height: 48px;background-color: #FF6666;margin-left: 17px">
                <i class="iconfont" style="color: #fff;font-size: 42px;margin-left: 30px;">&#xe634;</i>
                <span style="color: #fff;display:block;margin-top: -40px;margin-left: 80px">请使用微信扫一扫</span>
                <br>
                <span style="color: #fff;display:block;margin-top: -14px;margin-left: 80px">扫描二维码支付</span>
              </div>
            </div>
            <div>
              <img src="./img/sys.png" style="width: 300px;height: 300px">
            </div>
          </el-tab-pane>
          <el-tab-pane label="支付宝" name="second">
            <div style="float:left;margin-right: 80px">
              <img src="./img/zfb.jpg" style="width: 250px;height: 250px">
              <div style="width: 215px;height: 48px;background-color:#3478d9;margin-left: 17px">
                <i class="iconfont" style="color: #fff;font-size: 42px;margin-left: 30px;">&#xe634;</i>
                <span
                  style="color: #fff;display:block;margin-top: -40px;margin-left: 80px"
                >请使用支付宝扫一扫</span>
                <br>
                <span style="color: #fff;display:block;margin-top: -14px;margin-left: 80px">扫描二维码支付</span>
              </div>
            </div>
            <div>
              <img src="./img/zfbts.png" style="width: 170px;height: 300px">
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import pie from './component/PieChart'
import pieA from './component/PieChart_1'
import VDistpicker from 'v-distpicker'
import linkage from '@/views/components/linkage/linkage.vue'// 省 市 区三级联动
import {
  multiplication,
  division,
  rmoney,
  getFloat
} from './data/count' // 加减乘除
export default {
  name: 'Guide',
  components: {
    pie,
    pieA,
    VDistpicker,
    linkage
  },
  data () {
    return {
      tj_show: true,
      // 单击行数据
      row_click_data: {},
      sjs: '',
      zf_val: '',
      value_jsfs_3: '',
      value_hwlx_3: '',
      value_jsfs_2: '',
      value_hwlx_2: '',
      input_cz: '',
      dialogVisible_zf: false,
      activeName2: 'first',
      dialogVisible_cz: false,
      value_hwlx_1: '',
      value_jsfs_1: '',
      value_sl_1: '10%',
      value_sl_2: '',
      value_sl_3: '',
      options_jsfs: [
        {
          value: '选项1',
          label: '一般计税'
        },
        {
          value: '选项2',
          label: '简易计税'
        }
      ],
      options_hwlx: [
        {
          value: '选项1',
          label: '货物一'
        },
        {
          value: '选项2',
          label: '货物二'
        },
        {
          value: '选项3',
          label: '货物三'
        },
        {
          value: '选项4',
          label: '货物四'
        },
        {
          value: '选项5',
          label: '货物五'
        }
      ],
      options_sl: [
        {
          value: '选项1',
          label: '5'
        },
        {
          value: '选项2',
          label: '10'
        },
        {
          value: '选项3',
          label: '15'
        },
        {
          value: '选项4',
          label: '20'
        },
        {
          value: '选项5',
          label: '25'
        }
      ],
      radio_jzjt: 1,
      radio_zf: 3,
      // 查看发票
      dialogVisible_ptfp: false, // 普通发票
      dialogVisible_ckfp: false, // 专用发票
      input3_gsqc: '',
      input3_nsrsbh: '',
      input3_khyh: '',
      input3_yhzh: '',
      input3_dzdh: '',
      value_kpsq_tt: '',
      show_xzfptt: false,
      // 开票申请
      tableData_kpsq: [
        { key: '发票类型', value: '' },
        { key: '金额', value: '' },
        { key: '发票抬头', value: '' }
      ],
      value_kpsq: '',
      options_kpsq_tt: [
        {
          value: 1,
          label: '个人',
          disabled: false
        },
        {
          value: 2,
          label: '广东财道科技有限公司'
        }
      ],
      options_kpsq: [
        {
          value: '选项1',
          label: '普通发票'
        },
        {
          value: '选项2',
          label: '增值税专用发票'
        }
      ],
      chart: 'chart',
      style_pic: {
        height: '280px',
        width: '100%'
      },
      dialogVisible_fpsq: false,
      dialogFormVisible_htdzj: false,
      dialogVisible_lxxx: false,
      dialogVisible_zdmx: false,
      dialogVisible_ddxq: false,
      input_dd: '',
      tableData_fp: [
        {
          fphm: '464761313646456676',
          fptt: '海南信息服务有限公司',
          money: '13254',
          fplx: 1,
          data: '2018年12月',
          zt: 1
        },
        {
          fphm: '134687154649798778',
          fptt: '湖北信息服务有限公司',
          money: '16788',
          fplx: 2,
          data: '2018年12月',
          zt: 2
        },
        {
          fphm: '464761313646456767',
          fptt: '上海信息服务有限公司',
          money: '49879',
          fplx: 1,
          data: '2018年12月',
          zt: 3
        },
        {
          fphm: '988888131311213333',
          fptt: '广东信息服务有限公司',
          money: '22315',
          fplx: 1,
          data: '2018年12月',
          zt: 4
        },
        {
          fphm: '100264613264646545',
          fptt: '北京信息服务有限公司',
          money: '55554',
          fplx: 2,
          data: '2018年12月',
          zt: 5
        },
        {
          fphm: '100456532164565453',
          fptt: '福建信息服务有限公司',
          money: '36541',
          fplx: 2,
          data: '2018年12月',
          zt: 1
        }
      ],
      tableData_ht_dd: [
        {
          ddbh: '123111',
          yxq: '2019年12月',
          jfzq: 1,
          qfje: '1234.45',
          jsfs: 1,
          zt: 1
        },
        {
          ddbh: '2342341',
          yxq: '2019年12月',
          jfzq: 2,
          qfje: '23345.4',
          jsfs: 2,
          zt: 2
        },
        {
          ddbh: '3454312',
          yxq: '2019年12月',
          jfzq: 3,
          qfje: '34513',
          jsfs: 1,
          zt: 3
        },
        {
          ddbh: '789789',
          yxq: '2019年12月',
          jfzq: 2,
          qfje: '123555',
          jsfs: 2,
          zt: 4
        }
      ],
      // 账单明细 表格
      tableData_zdmx: [
        {
          name: '费用项 1',
          money: '16654'
        },
        {
          name: '费用项 2',
          money: '161687'
        }
      ],
      tableData_zdmx_1: [
        {
          name: '优惠折扣',
          money: '20%'
        },
        {
          name: '优惠抵减',
          money: '100'
        },
        {
          name: '实际应付',
          money: '700'
        }
      ],
      // 订单数据
      tableData_dd: [
        {
          ddbh: 'Z143453345345',
          spmc: '钢材',
          yxq: '50年',
          jfzq: 1,
          qfje: '3000',
          jsfs: 1,
          zt: 1
        },
        {
          ddbh: 'Z1686786785',
          spmc: '胶水',
          yxq: '2年',
          jfzq: 2,
          qfje: '3002',
          jsfs: 2,
          zt: 2
        },
        {
          ddbh: 'Z89891437645345',
          spmc: '化工用品',
          yxq: '5年',
          jfzq: 3,
          qfje: '3001230',
          jsfs: 1,
          zt: 3
        },
        {
          ddbh: 'Z0002342',
          spmc: '纱布 真丝',
          yxq: '1年',
          jfzq: 1,
          qfje: '3045300',
          jsfs: 2,
          zt: 4
        }
      ],
      // 筛选期间
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      dialogVisible_dd: false,
      // 合同 筛选 from
      form_3: {
        htbh: '',
        qdrq: '',
        xsry: '',
        khqzr: '',
        cdqzr: ''
      },
      // 账单列表
      from_zd: {
        code: '',
        fyqj: '',
        zffs: ''
      },
      // 新增基础信息
      form_2: {
        name: '',
        radio: 1,
        qydm: '',
        sfz: '',
        wbzh: '',
        wbmm: '',
        nsrsbh: '',
        nsrxz: [
          {
            value: '01',
            label: '一般纳税人'
          },
          {
            value: '02',
            label: '小规模纳税人'
          }
        ],
        skpkl: '',
        ptmm: ''
      },
      // 主页面筛选 form
      form_1: {
        name: '',
        code: '',
        value: '',
        value1: ''
      },
      show_item: false,
      radio: 1,
      sortable: null,
      // 上传列表
      fileList: [],
      // 修改
      index_upd: 0,
      delete_tab: [],
      options_jfgz: [
        {
          value: '选项1',
          label: '包月'
        },
        {
          value: '选项2',
          label: '包季'
        },
        {
          value: '选项3',
          label: '包年'
        },
        {
          value: '选项4',
          label: '全付'
        },
        {
          value: '选项5',
          label: '按量'
        }
      ],
      options: [
        {
          value: '01',
          label: '一般纳税人'
        },
        {
          value: '02',
          label: '小规模纳税人'
        }
      ],
      // 修改   表单信息
      form_upd: {
        name: '',
        code: '',
        addes: ''
      },
      // 新增   表单信息
      // 基本信息
      form: {
        name: '',
        region: '01',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      tableData_zdlb: [
        {
          zdbh: '24827492474914',
          fyqj: '2018年11月',
          money: '23000',
          zfzt: 1,
          zffs: 1
        },
        {
          zdbh: '1231131714124',
          fyqj: '2018年10月',
          money: '1231312',
          zfzt: 2,
          zffs: 2
        },
        {
          zdbh: '76432234241131',
          fyqj: '2018年6月',
          money: '93222',
          zfzt: 2,
          zffs: 3
        },
        {
          zdbh: '323423414121',
          fyqj: '2018年11月',
          money: '11111111',
          zfzt: 1,
          zffs: 4
        }
      ],
      // 合同
      tableData_dzht: [
        {
          htbh: 'qq合同电子件编号'
        },
        {
          htbh: 'ww合同电子件编号'
        },
        {
          htbh: 'ee合同电子件编号'
        },
        {
          htbh: 'rr合同电子件编号'
        },
        {
          htbh: 'tt合同电子件编号'
        },
        {
          htbh: 'yy合同电子件编号'
        },
        {
          htbh: 'uu合同电子件编号'
        }
      ],
      show_button: false,
      show_td: false,
      show_button_dd: false,
      show_td_dd: false,
      show_button_jfgz: false,
      show_td_jfgz: false,
      input3: '',
      input_4: '通过',
      // 用户联系信息
      tableData7: [
        { key: '姓名', value: '' },
        { key: '手机', value: '' },
        { key: '微信', value: '' },
        { key: 'QQ', value: '' }
      ],
      // 账单明细
      tableData6: [
        { key: '账单编号', value: '' },
        { key: '费用期间', value: '' },
        { key: '订单编号', value: '' },
        { key: '支付状态', value: '' },
        { key: '支付时间', value: '' },
        { key: '支付方式', value: '' }
      ],
      // 计费规则
      tableData5: [
        { key: '计费方式', value: '包月' },
        { key: '单价', value: '1000' },
        { key: '优惠折扣(off)', value: '20' },
        { key: '抵减', value: '200' }
      ],
      // 订单
      tableData4: [
        { key: '订单编号', value: '1111' },
        { key: '客户名称', value: '2222' },
        { key: '有效期', value: '3333' },
        { key: '计费周期', value: '4444' },
        { key: '状态', value: '5555' },
        { key: '订单商品', value: '6666' },
        { key: '创建人员', value: '7777' },
        { key: '创建日期', value: '8888' },
        { key: '备注', value: '9999' }
      ],
      // 合同
      tableData3: [
        { key: '合同名称', value: '1111' },
        { key: '客户名称', value: '2222' },
        { key: '签订日期', value: '3333' },
        { key: '合同编号', value: '4444' },
        { key: '合同金额', value: '5555' },
        { key: '客户签字人', value: '6666' },
        { key: '备注', value: '7777' },
        { key: '销售渠道', value: '1111' },
        { key: '签 字 人', value: '2222' },
        { key: '销售人员', value: '3333' },
        { key: '所属部门', value: '4444' },
        { key: '录入人员', value: '5555' },
        { key: '录入日期', value: '6666' }
      ],
      dialogVisible_ht: false,
      input_ht: '',
      tableData_ht: [
        {
          contract_name: 'qss使用协议',
          contract_number: 'Finway-001-008',
          ht_data: '2018-11-21',
          ht_money: '300000000',
          client_signatory: 'Adker',
          financial_street_signatory: 'Rertel',
          salesman: 'Ouer'
        },
        {
          contract_name: 'rey使用协议',
          contract_number: 'Finway-002-009',
          ht_data: '2018-11-22',
          ht_money: '8888888888',
          client_signatory: 'Sir',
          financial_street_signatory: 'Jac',
          salesman: 'Lonar'
        }
      ],
      // 实名认证
      dialogFormVisible_2: false,
      // 修改对话框
      dialogVisible_upd: false,
      // 新增对话框
      dialogVisible: false,
      // 主页面模糊查询 input
      input4: '',
      // 账单列表模糊查询 input
      input_zdlb: '',
      pagesize_fp: 10,
      currentPage4_fp: 1,
      pagesize: 10, // 当前页要展示多少条数据，默认10 “主页面分页”
      currentPage4: 1, // 当前页初始值设置为0 “主页面分页”
      pagesize_dd: 10,
      currentPage4_dd: 1,
      pagesize_zdlb: 10,
      currentPage4_zdlb: 1,
      tableData: [
        {
          name: '广东瑞芬纸业有限公司',
          id: 1,
          code: 'e648796313',
          address: '广东省广州市天河区东圃 花园上发中央广场 10栋六号 1068',
          data: '2018-02-08',
          money: '3000000'
        },
        {
          name: '上海有辉科技有限公司',
          id: 2,
          code: 'e649971653',
          address: '上海市普陀区金沙江路 1518 ',
          data: '2018-04-23',
          money: '800000'
        },
        {
          name: '深圳阿斯顿服装厂',
          id: 3,
          code: 'e69865131',
          address: '深圳市南山区深南大道9037号',
          data: '2018-05-18',
          money: '388000'
        },
        {
          name: '浙江惠美电子科技有限公司',
          id: 4,
          code: 'e648796313',
          address: '广东省深圳市南山区西丽湖路',
          data: '2018-06-01',
          money: '2300000'
        },
        {
          name: '清远利泰家具有限公司',
          id: 5,
          code: 'e648796313',
          address: '广东省 清远市清城区源潭镇峡山工业园',
          data: '2018-02-06',
          money: '10000000'
        },
        {
          name: '湖北瑞芬纸业有限公司',
          id: 6,
          code: 'e648796313',
          address: '广东省广州市天河区东圃 花园上发中央广场 10栋六号 1068',
          data: '2018-02-08',
          money: '3000000'
        },
        {
          name: '海南有辉科技有限公司',
          id: 7,
          code: 'e649971653',
          address: '上海市普陀区金沙江路 1518 ',
          data: '2018-04-23',
          money: '800000'
        },
        {
          name: '福建阿斯顿服装厂',
          id: 8,
          code: 'e69865131',
          address: '深圳市南山区深南大道9037号',
          data: '2018-05-18',
          money: '388000'
        },
        {
          name: '北京惠美电子科技有限公司',
          id: 9,
          code: 'e648796313',
          address: '广东省深圳市南山区西丽湖路',
          data: '2018-06-01',
          money: '2300000'
        },
        {
          name: '江西利泰家具有限公司',
          id: 10,
          code: 'e648796313',
          address: '广东省 清远市清城区源潭镇峡山工业园',
          data: '2018-02-06',
          money: '10000000'
        }
      ],
      tableData_add: [
        {
          names: 'Qruizi',
          job: 'java 软件工程师 ',
          phone: '13265497892',
          email: 'Qruizi123ycs@cdkj.com',
          qq: '57239579/qwieuyasdaasfasasd',
          is_show: false
        },
        {
          names: 'Mayr',
          job: 'web 前端工程师',
          phone: '16645928856',
          email: 'Mayr123ycs@cdkj.com',
          qq: '57239579/qwieuyasdaasf',
          is_show: false
        },
        {
          names: 'Hert',
          job: 'web 前端工程师',
          phone: '16645928856',
          email: 'Mayr123ycs@cdkj.com',
          qq: '4534536364/fsdhbcvbcnfgd',
          is_show: false
        },
        {
          names: 'Mayr',
          job: 'web 前端工程师',
          phone: '16645928856',
          email: 'Mayr123ycs@cdkj.com',
          qq: '4525262247/qwieuyasdaasf',
          is_show: false
        },
        {
          names: 'Tert',
          job: 'web 前端工程师',
          phone: '16645928856',
          email: 'Mayr123ycs@cdkj.com',
          qq: '234364/hjhlftyfggh',
          is_show: false
        },
        {
          names: 'Wyio',
          job: 'java 软件工程师 ',
          phone: '13265497892',
          email: 'Qruizi123ycs@cdkj.com',
          qq: '12354336/mmhftyer',
          is_show: false
        },
        {
          names: 'Jsck',
          job: 'java 软件工程师 ',
          phone: '13265497892',
          email: 'Qruizi123ycs@cdkj.com',
          qq: '908566684/qthfhfghfghf',
          is_show: false
        }
      ]
    }
  },

  computed: {
    // 主页面模糊查询
    tables () {
      const search = this.input4
      if (search) {
        return this.tableData.filter(dataNews => {
          return Object.keys(dataNews).some(key => {
            return (
              String(dataNews[key])
                .toLowerCase()
                .indexOf(search) > -1
            )
          })
        })
      }
      return this.tableData.slice(
        (this.currentPage4 - 1) * this.pagesize,
        this.currentPage4 * this.pagesize
      )
    },
    // 订单页面模糊查询
    tables_dd () {
      const search = this.input_dd
      if (search) {
        return this.tableData_dd.filter(dataNews => {
          return Object.keys(dataNews).some(key => {
            return (
              String(dataNews[key])
                .toLowerCase()
                .indexOf(search) > -1
            )
          })
        })
      }
      return this.tableData_dd.slice(
        (this.currentPage4_dd - 1) * this.pagesize_dd,
        this.currentPage4_dd * this.pagesize_dd
      )
    },
    // 订单页面模糊查询
    tables_zdlb () {
      const search = this.input_zdlb
      if (search) {
        return this.tableData_zdlb.filter(dataNews => {
          return Object.keys(dataNews).some(key => {
            return (
              String(dataNews[key])
                .toLowerCase()
                .indexOf(search) > -1
            )
          })
        })
      }
      return this.tableData_zdlb.slice(
        (this.currentPage4_zdlb - 1) * this.pagesize_zdlb,
        this.currentPage4_zdlb * this.pagesize_zdlb
      )
    }
  },
  mounted () {},
  created () {
    this.someMethodIThinkMightBeSlow()
  },
  methods: {
    // 选择地区
    onSelected (data) {
      console.log(data)
    },
    someMethodIThinkMightBeSlow () {
      const startTime = performance.now()
      const duration = performance.now() - startTime
      console.log(`someMethodIThinkMightBeSlow took ${duration}ms`)
    },
    // 新增修改 基本信息 联系人
    clickCell (row, cell) {
      if (row.is_show || cell.id === 'el-table_2_column_14') {
        return
      }
      row.is_show = true
      const row_click_data = this.row_click_data
      if (row_click_data.is_show) {
        row_click_data.is_show = false
      }
      this.row_click_data = row
    },
    zf1_click () {
      this.zf_val = '22132.23'
      this.sjs = Math.ceil(Math.random() * 100000000)
      this.dialogVisible_zf = true
    },
    // 充值页面 支付按钮
    zf_click () {
      if (this.input_cz !== '') {
        this.zf_val = this.input_cz
        this.sjs = Math.ceil(Math.random() * 100000000)
        this.dialogVisible_zf = true
      } else {
        this.$notify.error({
          title: '错误',
          message: '请输入要充值的金额'
        })
      }
    },
    // 支付页面 标签
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 查看发票
    chakan_fp (row) {
      if (row.fplx === 1) {
        this.dialogVisible_ckfp = true
      } else if (row.fplx === 2) {
        this.dialogVisible_ptfp = true
      }
    },
    change_sl_1 (row) {
      this.value_sl_1 = row + '%'
    },
    change_sl_2 (row) {
      this.value_sl_2 = row + '%'
    },
    change_sl_3 (row) {
      this.value_sl_3 = row + '%'
    },
    // 开票申请  发票类型变动
    fplx_change (ro) {
      if (ro === '增值税专用发票') {
        this.options_kpsq_tt[0].disabled = true
      } else {
        this.options_kpsq_tt[0].disabled = false
      }
    },
    // 开票申请提交
    dis_kpsq () {
      const money = parseFloat(this.tableData_kpsq[1].value)

      if (this.value_kpsq === '') {
        this.$notify({
          title: '警告',
          message: '请选择开票类型',
          type: 'warning'
        })
      } else {
        if (money !== '' && money > 0) {
          if (this.value_kpsq_tt === '') {
            this.$notify({
              title: '警告',
              message: '请选择发票抬头',
              type: 'warning'
            })
          } else {
            if (
              this.value_kpsq_tt === '个人' ||
              this.value_kpsq_tt === '广东财道科技有限公司'
            ) {
              this.$notify.info({
                title: '消息',
                message: '已提交开票申请'
              })
            } else {
              if (
                this.input3_gsqc === '' ||
                this.input3_nsrsbh === '' ||
                this.input3_khyh === '' ||
                this.input3_yhzh === '' ||
                this.input3_dzdh === ''
              ) {
                this.$notify.error({
                  title: '错误',
                  message: '您所选择的发票抬头，缺增值税专用发票开具所需信息'
                })
              } else {
                const qw = this.value_kpsq_tt + '已提交开票申请'
                this.$notify.info({
                  title: '消息',
                  message: qw
                })
              }
            }
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: '金额必须大于0才能申请开票'
          })
        }
      }
    },
    save_fptt () {
      this.show_xzfptt = false
      this.tj_show = true
      const num = this.options_kpsq_tt.length
      const uu = {
        value: num + 1,
        label: this.input3_gsqc
      }
      this.options_kpsq_tt.push(uu)
    },
    add_select () {
      this.tj_show = false
      this.show_xzfptt = true
      this.$refs.select_ref.blur()
    },
    // 开发票
    kfp () {
      this.dialogVisible_fpsq = true
      this.options_kpsq_tt[0].disabled = false
      this.input3_gsqc = ''
      this.input3_nsrsbh = ''
      this.input3_khyh = ''
      this.input3_yhzh = ''
      this.input3_dzdh = ''
      this.value_kpsq_tt = ''
      this.value_kpsq = ''
    },
    show_lxrxx (ro) {
      this.dialogVisible_lxxx = true
      this.tableData7[0].value = ro
    },
    htdd_gb (row) {
      row.zt = 4
    },
    // 新增合同按钮
    add_ht () {
      this.dialogVisible_ht = true
      this.tableData3[0].value = ''
      this.tableData3[1].value = ''
      this.tableData3[2].value = ''
      this.tableData3[3].value = ''
      this.tableData3[4].value = ''
      this.tableData3[5].value = ''
      this.tableData3[6].value = ''
      this.tableData3[7].value = ''
      this.tableData3[8].value = ''
      this.tableData3[9].value = ''
      this.tableData3[10].value = ''
      this.tableData3[11].value = ''
      this.tableData3[12].value = ''
      this.tableData_dzht = []
      this.tableData_ht_dd = []
      this.input_4 = ''
    },
    // 账单明细
    zdmx_open (row) {
      this.dialogVisible_zdmx = true
      this.tableData6[0].value = row.zdbh
      this.tableData6[1].value = row.fyqj
      this.tableData6[2].value = '1316464'
      this.tableData6[3].value = row.zfzt
      this.tableData6[4].value = '2018年1月'
      this.tableData6[5].value = row.zffs
    },
    zd_zf (row) {
      row.zfzt = 2
      this.$notify({
        title: '成功',
        message: '账单支付成功！！',
        type: 'success'
      })
    },
    // 订单详情  折扣变动
    dj_change1 () {
      const zk = division(this.tableData5[2].value, 100)
      const dk = multiplication(this.tableData5[1].value, zk)
      this.tableData5[1].value = rmoney(this.tableData5[1].value)
      this.tableData5[3].value = rmoney(getFloat(dk, 2))
    },
    // 订单详情  单价变动
    dj_change () {
      const zk = division(this.tableData5[2].value, 100)
      const dk = multiplication(this.tableData5[1].value, zk)
      this.tableData5[3].value = rmoney(getFloat(dk, 2))
    },
    // 打开订单
    dd_open () {
      this.dialogVisible_dd = true
    },
    // 账单列表筛选
    zdlb () {
      const htbh = this.from_zd.code
      const qdrq = this.from_zd.fyqj
      const xsry = this.from_zd.zffs
      const h = this.$createElement
      this.$notify({
        title: '账单列表筛选数据：',
        position: 'bottom-right',
        message: h(
          'i',
          { style: 'color: teal' },
          '[' + htbh + ',' + qdrq + ',' + xsry + ']'
        )
      })
    },
    // 主页面筛选
    zy_sx () {
      const htbh = this.form_1.name
      const qdrq = this.form_1.code
      const xsry = this.form_1.value
      const h = this.$createElement
      this.$notify({
        title: '主页筛选数据：',
        position: 'bottom-right',
        message: h(
          'i',
          { style: 'color: teal' },
          '[' + htbh + ',' + qdrq + ',' + xsry + ']'
        )
      })
    },
    // 合同 筛选数据
    ht_sx () {
      const htbh = this.form_3.htbh
      const qdrq = this.form_3.qdrq
      const xsry = this.form_3.xsry
      const khqzr = this.form_3.khqzr
      const cdqzr = this.form_3.cdqzr
      const h = this.$createElement
      this.$notify({
        title: '合同筛选数据：',
        position: 'bottom-right',
        message: h(
          'i',
          { style: 'color: teal' },
          '[' + htbh + ',' + qdrq + ',' + xsry + ',' + khqzr + ',' + cdqzr + ']'
        )
      })
    },
    radio_change (label) {
      if (label === 1) {
        this.show_item = false
      } else if (label === 2) {
        this.show_item = true
      }
    },
    // 合同筛选提交
    onSubmit () {},
    // 修改计费规则
    updata_jfgz () {
      this.show_button_jfgz = false
      this.show_td_jfgz = false
    },
    // 计费规则保存
    add_jfgz () {
      this.show_button_jfgz = true
      this.show_td_jfgz = true
      this.$notify({
        title: '成功',
        message: '计费规则保存成功！！',
        type: 'success'
      })
    },
    // 修改订单信息
    updata_ddxq () {
      this.show_button_dd = false
      this.show_td_dd = false
    },
    // 订单信息保存
    add_ddxq () {
      this.show_button_dd = true
      this.show_td_dd = true
      this.$notify({
        title: '成功',
        message: '订单信息保存成功！！',
        type: 'success'
      })
    },
    // 合同
    // 删除合同编号
    deleteRow_htbh (index, rows) {
      rows.splice(index, 1)
    },
    // 修改合同信息
    updata_htxx () {
      this.show_button = false
      this.show_td = false
    },
    // 合同信息保存
    add_htxx () {
      this.show_button = true
      this.show_td = true
      this.$notify({
        title: '成功',
        message: '合同信息保存成功！！',
        type: 'success'
      })
    },
    dialogVisible_hts () {
      this.dialogVisible_ht = true
      this.show_td = false
      this.show_button = false
    },
    dialogVisible_dds () {
      this.dialogVisible_ddxq = true
      this.show_td = false
      this.show_button = false
    },
    // 订单详情页关闭
    handleClose_ddxq () {
      this.$confirm('此操作将不会保存已编辑信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.dialogVisible_ddxq = false
          this.$notify.info({
            title: '消息',
            message: '已退出修改订单信息的操作！'
          })
        })
        .catch(() => {
          this.$notify.info({
            title: '消息',
            message: '继续修改订单信息的操作！'
          })
        })
    },
    // 合同详情页关闭
    handleClose_ht () {
      this.$confirm('此操作将不会保存已编辑信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.dialogVisible_ht = false
          this.$notify.info({
            title: '消息',
            message: '已退出修改合同信息的操作！'
          })
        })
        .catch(() => {
          this.$notify.info({
            title: '消息',
            message: '继续修改合同信息的操作！'
          })
        })
    },
    // 删除合同单条信息
    deleteRow_ht (index, rows, ro) {
      const ti =
        '确认删除合同《' + ro.contract_name + '》-' + ro.contract_number + '？'
      this.$confirm(ti, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          rows.splice(index, 1)
          this.$notify({
            title: '成功',
            message: '删除合同信息成功！',
            type: 'success'
          })
        })
        .catch(() => {
          this.$notify.info({
            title: '消息',
            message: '已取消删除！'
          })
        })
    },
    // 上传
    submitUpload1 () {
      this.$refs.upload1.submit()
    },
    submitUpload2 () {
      this.$refs.upload2.submit()
    },
    submitUpload3 () {
      this.$refs.upload3.submit()
    },
    // 上传成功
    sus_upload (response, file, fileList) {
      const sus = file.name
      this.$notify({
        title: '成功',
        message: sus + '上传成功',
        type: 'success'
      })
    },
    // 上传失败
    error_upload (file, fileList) {
      const namee = file.name
      this.$notify.error({
        title: namee + '上传失败',
        message: '抱歉你没有合法的上传服务地址'
      })
    },
    handleRemove (file, fileList) {
      const sus = file.name
      this.$notify({
        title: '成功',
        message: sus + '移除成功',
        type: 'success'
      })
    },
    handlePreview (file) {},
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },

    // 修改弹窗 修改按钮
    dialog_upd () {
      this.tableData[this.index_upd].name = this.form_upd.name
      this.tableData[this.index_upd].code = this.form_upd.code
      this.tableData[this.index_upd].address = this.form_upd.addes
      this.dialogVisible_upd = false
      this.$notify({
        title: '成功',
        message: '客户信息修改成功！',
        type: 'success'
      })
    },
    // 主页面修改
    upd_tabel (index, row) {
      this.index_upd = index
      this.dialogVisible = true /*
        this.form_upd.name=row.name
        this.form_upd.code=row.code
        this.form_upd.addes=row.address*/
    },
    // 主页删除单条信息
    deleteRow (index, rows) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          rows.splice(index, 1)
          this.$notify({
            title: '成功',
            message: '删除客户信息成功！',
            type: 'success'
          })
        })
        .catch(() => {
          this.$notify.info({
            title: '消息',
            message: '已取消删除！'
          })
        })
    },
    // 主页多选框
    selec_change (val) {
      this.delete_tab = val
    },
    select (val, row) {},
    // 批量删除
    delete_zhu () {
      if (this.delete_tab.length === 0) {
        this.$notify.error({
          title: '错误',
          message: '请选择要删除的数据！！'
        })
      } else {
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            for (let i = 0; i < this.tableData.length; i++) {
              for (let j = 0; j < this.delete_tab.length; j++) {
                if (this.tableData[i].id === this.delete_tab[j].id) {
                  this.tableData.splice(i, 1)
                }
              }
            }
            this.$notify({
              title: '成功',
              message: '批量删除客户信息成功！',
              type: 'success'
            })
          })
          .catch(() => {
            this.$notify.info({
              title: '消息',
              message: '已取消删除！'
            })
          })
      }
    },
    // 新增 基本信息  保存
    save_add () {},
    // 新增 基本信息  表格 新增
    handleAdd (index, row) {
      const item = {
        names: '',
        job: '',
        phone: '',
        email: '',
        qq: '',
        is_show: true
      }
      this.tableData_add.splice(index + 1, 0, item)
      if (this.row_click_data.is_show) {
        this.row_click_data.is_show = false
      }
    },
    // 新增 基本信息  表格 删除
    handleDelete (index, rows) {
      rows.splice(index, 1)
    },
    // 修改对话框关闭提示
    handleClose_upd (done) {
      this.$confirm('此操作将不会保存已编辑信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.dialogVisible_upd = false
          this.$notify.info({
            title: '消息',
            message: '已退出修改客户信息的操作！'
          })
        })
        .catch(() => {
          this.$notify.info({
            title: '消息',
            message: '继续修改客户信息的操作！'
          })
        })
    },
    // 新增对话框关闭提示
    handleClose (done) {
      this.$confirm('此操作将不会保存已编辑信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.dialogVisible = false
          this.$notify.info({
            title: '消息',
            message: '已退出客户新增的操作'
          })
        })
        .catch(() => {
          this.$notify.info({
            title: '消息',
            message: '继续新增客户的操作！'
          })
        })
    },
    // render 事件
    renderHeader (h, { column }) {
      return h('div', [
        h('span', column.label),
        h('i', {
          class: 'el-icon-location',
          style: 'color:#409eff;margin-left:5px;'
        })
      ])
    },
    // 分页 发票
    handleSizeChange_fp (val) {
      this.pagesize_fp = val
    },
    // 分页 发票
    handleCurrentChange_fp (val) {
      this.currentPage4_fp = val
    },
    // 分页 订单页面 账单列表
    handleSizeChange_zdlb (val) {
      this.pagesize_zdlb = val
    },
    // 分页 订单页面 账单列表
    handleCurrentChange_zdlb (val) {
      this.currentPage4_zdlb = val
    },
    // 分页 订单页面
    handleSizeChange_dd (val) {
      this.pagesize_dd = val
    },
    // 分页 订单页面
    handleCurrentChange_dd (val) {
      this.currentPage4_dd = val
    },
    // 分页 主页面
    handleSizeChange (val) {
      this.pagesize = val
    },
    // 分页 主页面
    handleCurrentChange (val) {
      this.currentPage4 = val
    }
  }
}
</script>
<style>
.sortable-ghost {
  opacity: 0.7;
  color: #fff !important;
  background: #e0e0e0 !important;
}
.el-card__header {
  background-color: #f8f8f8;
}
</style>
<style>

@font-face {
  font-family: "iconfont"; /* project id 755950 */
  src: url("//at.alicdn.com/t/font_755950_wc7aq8dd8u.eot");
  src: url("//at.alicdn.com/t/font_755950_wc7aq8dd8u.eot?#iefix")
      format("embedded-opentype"),
    url("//at.alicdn.com/t/font_755950_wc7aq8dd8u.woff") format("woff"),
    url("//at.alicdn.com/t/font_755950_wc7aq8dd8u.ttf") format("truetype"),
    url("//at.alicdn.com/t/font_755950_wc7aq8dd8u.svg#iconfont") format("svg");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.el-tooltip__popper.is-dark {
  background: #fff;
  color: #666666;
  border: 1px dashed #3478d9;
}
.el-tooltip__popper.is-dark[x-placement^="top"] .popper__arrow {
  border-top-style: dashed;
  border-top-color: #3478d9;
}
.el-tooltip__popper[x-placement^="top"] .popper__arrow::after {
  border-top-color: #fafffd;
}
.el-tooltip__popper.is-dark[x-placement^="bottom"] .popper__arrow {
  border-bottom-style: dashed;
  border-bottom-color: #3478d9;
}
.el-tooltip__popper[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: #fafffd;
}

/* .tb-edit .el-input {
  display: none;
}

.tb-edit .current-row .el-input {
  display: block;
}

.tb-edit .current-row .el-input + span {
  display: none;
} */
.column {
  background-color: #f8f8f8;
  height: 30px;
  border: 1px #dddddd solid;
  text-align: center;
  font-size: 14px;
}
.column2 {
  padding: 0px;
  height: 29px;
  border: 1px #dddddd solid;
  text-align: center;
  font-size: 13px;
}
.column3 {
  background-color: #f8f8f8;
  height: 39px;
  border: 1px #dddddd solid;
  text-align: center;
  font-size: 14px;
}
.column4 {
  height: 39px;
  border: 1px #dddddd solid;
  text-align: center;
  font-size: 13px;
}
.mailTable {
  border-collapse: collapse;
  margin-top: -2px;
}
.el-card__header {
  padding: 8px 10px;
}
.el-card__body {
  padding: 0px;
}
/*加了scoped的写法*/
/* .el-card__header[data-v-51a1741d] {
    padding: 18px 20px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
} */
.form_ite {
  height: 16px;
  color: #99a9bf;
}
.addButten {
  text-align: center;
  width: 244px;
  height: 27px;
  background-color: #ffffff;
  position: fixed;
  margin-left: -1px;
  border: 1px solid #dcdfe6;
  background: #fafcfd;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  cursor: pointer;
}
.el-dialog__footer {
  padding: 20px;
  padding-top: 10px;
  text-align: right;
  height: 51px;
  background-color: #ccc;
  box-sizing: border-box;
}

</style>
