<template>
    <main-wrapper class="employee-edit">
        <div class="main-header" slot="header">
            <el-button type="primary" size="small" @click="beforeSubmit" v-if="!isDisplay">保存</el-button>
            <el-button type="danger" size="small" @click="resetForm" >扶養情報更新</el-button>
            <el-button size="small" @click="$router.back()">リターン</el-button>
        </div>
        <el-row class="minwidth" v-if="!isDisplay">
            <el-col :span="14">
                <el-form size="small" label-width="130px" ref="form" :model="isDisplay ? {} : form" :rules="isDisplay ? {} : rules">
                    <el-row >
                        <el-col :span="12">
                            <el-form-item label="就職タイプ" prop="employeeTypeID">
                                <el-select v-model="form.employeeTypeID" @change="selsectEmployee">
                                    <el-option v-for="item in employeeTypes" :key="item.id" :value="item.id" :label="item.title"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if='isEmplooe'>
                            <el-form-item label="パートナー" prop="vendorID">
                                <el-select v-model="form.vendorID">
                                    <el-option v-for="item in vendorsArr" :key="item.id" :value="item.id" :label="item.title"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="常住都市" prop="liveCity">
                                <el-select v-model="form.liveCity">
                                    <el-option v-for="item in cityTypes" :key="item.id" :value="item.id" :label="item.text"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row >
                        <el-col :span="12">
                            <el-form-item label="姓（フリガナ）" prop="furigana_FirstName">
                                <!-- <p v-if="isDisplay">{{form.furigana_FirstName}}</p> -->
                                <el-input v-model="form.furigana_FirstName" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="名（フリガナ）" prop="furigana_LastName">
                                <!-- <p v-if="isDisplay">{{form.furigana_LastName}}</p> -->
                                <el-input v-model="form.furigana_LastName" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row >
                        <el-col :span="12">
                            <el-form-item label="姓（英語）" prop="pinYin_FirstName">
                                <el-input v-model="form.pinYin_FirstName" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="名（英語）" prop="pinYin_LastName">
                                <el-input v-model="form.pinYin_LastName" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- <el-form-item label="姓（フリガナ）" prop="furigana_FirstName">
                        <el-input v-model="form.furigana_FirstName" :maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="名（フリガナ）" prop="furigana_LastName">
                        <el-input v-model="form.furigana_LastName" :maxlength="20"></el-input>
                    </el-form-item> -->
                    <el-row >
                        <el-col :span="12">
                            <el-form-item label="姓（漢字）" prop="firstName">
                                <!-- <p v-if="isDisplay">{{form.firstName}}</p> -->
                                <el-input v-model="form.firstName" :maxlength="20" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="名（漢字）" prop="lastName">
                                <!-- <p v-if="isDisplay">{{form.lastName}}</p> -->
                                <el-input v-model="form.lastName" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- <el-form-item label="姓（漢字）" prop="firstName" v-if="IS_H5">
                        <el-input v-model="form.firstName" :maxlength="20"></el-input>
                    </el-form-item> -->
                    <!-- <el-form-item label="名（漢字）" prop="lastName" v-if="IS_H5">
                        <el-input v-model="form.lastName" :maxlength="20"></el-input>
                    </el-form-item> -->
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="入社日" prop="onBoardDate">
                                <!-- <p v-if="isDisplay">{{form.onBoardDate}}</p> -->
                                <el-date-picker
                                    v-model="form.onBoardDate"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性別" prop="sex">
                                <!-- <p v-if="isDisplay">{{getContent(form.sex, sexs, 'value', 'label')}}</p> -->
                                <el-select v-model="form.sex">
                                    <el-option v-for="(item, i) in sexs" :key="i" :value="item.value" :label="item.label"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> 
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="生年月日" prop="birthday">
                                <!-- <p v-if="isDisplay">{{form.birthday}}</p> -->
                                <el-date-picker
                                    v-model="form.birthday"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <!-- <el-form-item label="国籍" prop="nationality">
                                <p v-if="isDisplay">{{form.nationality}}</p>
                                <el-input v-model="form.nationality" :maxlength="10" v-else></el-input>
                            </el-form-item> -->
                            <el-form-item label="国籍" prop="nationality">
                                <!-- <p v-if="isDisplay">{{form.nationality}}</p> -->
                                <el-select v-model="form.nationality" @change="selsectNation">
                                    <el-option v-for="item in countryTypeArr" :key="item.id" :value="item.id" :label="item.text"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="最寄り駅" prop="station">
                                <!-- <p v-if="isDisplay">{{form.station}}</p> -->
                                <el-input v-model="form.station" :maxlength="20" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="メインスキル" prop="mainSkill">
                                <!-- <p v-if="isDisplay">{{form.mainSkill}}</p> -->
                                <el-input v-model="form.mainSkill" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="経験年数" prop="startWorkDate">
                                <!-- <p v-if="isDisplay">{{form.startWorkDate}}</p> -->
                                <el-date-picker
                                    v-model="form.startWorkDate"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="ポジション" prop="positionID">
                                <!-- <p v-if="isDisplay">{{getContent(form.positionID, positions, 'id', 'title')}}</p> -->
                                <el-select v-model="form.positionID" >
                                    <el-option v-for="item in positions" :key="item.id" :label="item.title" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12" v-if="ishight">
                            <el-form-item label="来日時間" prop="arriveJPDate">
                                <!-- <p v-if="isDisplay">{{form.arriveJPDate}}</p> -->
                                <el-date-picker
                                    v-model="form.arriveJPDate"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <!-- <el-form-item label="所属部門" v-if="isDisplay">
                                <p>{{getContent(form.teamMembers, teams, 'id', 'teamName')}}</p>
                            </el-form-item> -->
                            <el-form-item label="所属部門" prop="teamMembers" v-if="!isEdit && !isDisplay">
                                <el-select v-model="form.teamMembers">
                                    <el-option v-for="item in teams" :key="item.id" :label="item.teamName" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="日本語能力">
                                <!-- <p v-if="isDisplay">{{getContent(form.jpLangCert, jpLangs, 'value', 'label')}}{{form.jpLangComt}}</p> -->
                                <el-select v-model="form.jpLangCert">
                                    <el-option v-for="item in jpLangs" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="!isDisplay">
                            <el-form-item label="">
                                <el-input v-model="form.jpLangComt" placeholder="日语能力"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="英語能力">
                        <!-- <p v-if="isDisplay">{{form.enLangComt}}</p> -->
                        <el-input v-model="form.enLangComt" ></el-input>
                    </el-form-item>
                    <el-form-item label="資格認定">
                        <!-- <p v-if="isDisplay">{{this.getCerts()}}</p> -->
                        <el-checkbox-group v-model="form.certificates">
                            <el-checkbox v-for="item in certificates" :key="item.id" :label="item.id">{{item.certName}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-row v-if="!isEdit">
                        <el-col :span="12">
                            <el-form-item label="绩效工资" prop="PJSalary" :class="[emptyTip && 'error-input']">
                                <!-- <p v-if="isDisplay">{{priceToString(form.PJSalary)}}</p> -->
                                <el-input v-model="form.PJSalary" @input="formatPrice('PJSalary')" @blur="validSalePrice('PJSalary')"></el-input>
                                <p color="danger" v-if="emptyTip">绩效工资不低于基本工资</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="基本工资" prop="BaseSalary" :class="[emptyTip && 'error-input']">
                                <!-- <p v-if="isDisplay">{{priceToString(form.BaseSalary)}}</p> -->
                                <el-input v-model="form.BaseSalary" @input="formatPrice('BaseSalary')" @blur="validSalePrice('BaseSalary')" ></el-input>
                                <p color="danger" v-if="emptyTip">绩效工资不低于基本工资</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="工资的备注" v-if="!isEdit">
                        <!-- <p v-if="isDisplay">{{form.SComment}}</p> -->
                        <el-input v-model="form.SComment" :maxlength="50"></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="提案単価" prop="salePriceFrom" :class="[errorTip && 'error-input']">
                                <!-- <p v-if="isDisplay">{{priceToString(form.salePriceFrom)}}~{{priceToString(form.salePriceTo)}}</p> -->
                                <el-input @input="formatPrice('salePriceFrom')" @blur="validSalePrice('salePriceFrom')" v-model="form.salePriceFrom" ></el-input>
                                <p color="danger" v-if="errorTip">提案単価範囲が不正です！</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="!isDisplay">
                            <el-form-item label="">
                                <el-input @input="formatPrice('salePriceTo')" @blur="validSalePrice('salePriceTo')" v-model="form.salePriceTo"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- <el-form-item label="销售价格" :class="[errorTip && 'error-input']">
                        <p v-if="isDisplay">{{priceToString(form.salePriceFrom)}}~{{priceToString(form.salePriceTo)}}</p>
                        <el-row v-else>
                            <el-col :span="12">
                                <el-input @input="formatPrice('salePriceFrom')" @blur="validSalePrice('salePriceFrom')" v-model="form.salePriceFrom"></el-input>
                            </el-col>
                            <el-col :span="10" :offset="2">
                                <el-input @input="formatPrice('salePriceTo')" @blur="validSalePrice('salePriceTo')" v-model="form.salePriceTo"></el-input>
                            </el-col>
                        </el-row>
                        <p color="danger" v-if="errorTip">起始价格不得大于最终价格</p>
                    </el-form-item> -->
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="出張条件">
                                <!-- <p v-if="isDisplay">{{form.travel}}</p> -->
                                <el-input v-model="form.travel" :maxlength="50"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="希望案件">
                                <!-- <p v-if="isDisplay">{{form.expectPJ}}</p> -->
                                <el-input v-model="form.expectPJ" :maxlength="50" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="コメント">
                        <!-- <p v-if="isDisplay">{{form.comment}}</p> -->
                        <el-input v-model="form.comment" type="textarea" :rows="3" :maxlength="200"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="10" v-if='$route.params.id&&istrue'>
                <card-upload :opt="{btnText: '上传照片', w: 300, h: 400, field: 'logoImage'}" @success="upload"></card-upload>
                <div class="imgid" v-if='imgIds.length>0'>
                    <div v-for="(item, index) in imgIds" :key='index'>
                        <img :src="item.url">
                        <i class="posis el-icon-delete oper-icon" color="danger" @click="deleteimage(item.id)"></i>
                    </div>
                </div>
            </el-col>
            <el-col :span="12" v-if="isDisplay">
                <div class="top"></div>
            </el-col>
        </el-row>
        <div class="disbled" v-if="isDisplay">
            <div class="bottom">
                <ul>
                    <li>
                        <span>姓（フリガナ）</span>
                        <span>{{form.furigana_FirstName}}</span>
                    </li>
                    <li>
                        <span>名（フリガナ）</span>
                        <span>{{form.furigana_LastName}}</span>
                    </li>
                    <li>
                        <span>姓（英語）</span>
                        <span>{{form.pinYin_FirstName}}</span>
                    </li>
                    <li>
                        <span>名（英語）</span>
                        <span>{{form.pinYin_LastName}}</span>
                    </li>
                    <li>
                        <span>姓（漢字）</span>
                        <span>{{form.firstName}}</span>
                    </li>
                    <li>
                        <span>名（漢字）</span>
                        <span>{{form.lastName}}</span>
                    </li>
                    <li>
                        <span>就職タイプ</span>
                        <span>{{getContent(form.employeeTypeID, employeeTypes, 'id', 'title')}}</span>
                    </li>
                    <li>
                        <span>常住都市</span>
                        <span>{{getContent(form.liveCity, cityTypes, 'id', 'text')}}</span>
                    </li>
                    <li>
                        <span>性别</span>
                        <span>{{getContent(form.sex, sexs, 'value', 'label')}}</span>
                    </li>
                    <li>
                        <span>入社日</span>
                        <span>{{form.onBoardDate}}</span>
                    </li>
                    <li>
                        <span>生年月日</span>
                        <span>{{form.birthday}}</span>
                    </li>
                    <li>
                        <span>国籍</span>
                        <span>{{getContent(form.nationality, countryTypeArr, 'id', 'text')}}</span>
                    </li>
                    <li>
                        <span>最寄り駅</span>
                        <span>{{form.station}}</span>
                    </li>
                    <li>
                        <span>メインスキル</span>
                        <span>{{form.mainSkill}}</span>
                    </li>
                    <li>
                        <span>経験年数</span>
                        <span>{{form.startWorkDate}}</span>
                    </li>
                    <li>
                        <span>ポジション</span>
                        <span>{{getContent(form.positionID, positions, 'id', 'title')}}</span>
                    </li>
                    <li>
                        <span>来日時間</span>
                        <span>{{form.arriveJPDate}}</span>
                    </li>
                    <!-- <li>
                        <span>所属部門</span>
                        <span>{{getContent(form.teamMembers, teams, 'id', 'teamName')}}</span>
                    </li> -->
                    <li>
                        <span>日本語能力</span>
                        <span>{{getContent(form.jpLangCert, jpLangs, 'value', 'label')}}</span>
                    </li>
                    <li>
                        <span>英語能力</span>
                        <span>{{form.enLangComt}}</span>
                    </li>
                    <li>
                        <span>資格認定</span>
                        <span>{{this.getCerts()}}</span>
                    </li>
                    <!-- <li>
                        <span>绩效工资</span>
                        <span>{{priceToString(form.PJSalary)}}</span>
                    </li>
                    <li>
                        <span>基本工资</span>
                        <span>{{priceToString(form.BaseSalary)}}</span>
                    </li>
                    <li>
                        <span>工资的备注</span>
                        <span>{{form.SComment}}</span>
                    </li> -->
                    <li>
                        <span>提案単価</span>
                        <span>{{priceToString(form.salePriceFrom)}}~{{priceToString(form.salePriceTo)}}</span>
                    </li>
                    <li>
                        <span>出張条件</span>
                        <span>{{form.travel}}</span>
                    </li>
                    <li class="lis">
                        <span>希望案件</span>
                        <span>{{form.expectPJ}}</span>
                    </li>
                    <li>
                        <span>コメント</span>
                        <span :title='form.comment'>{{form.comment}}</span>
                    </li>
                </ul>
            </div>
            <div class="bottom">
                <el-table :data="form.salaries" size="small" border>
                    <el-table-column label="时间" width="100px">
                        <template slot-scope="scope">
                            <p>{{formatTime(scope.row.fromDate)}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="绩效工资" prop="pjSalary" width="100px"></el-table-column>
                    <el-table-column label="基本工资" prop="baseSalary" width="100px"></el-table-column>
                    <el-table-column label="工资的备注" prop="comment">
                        <template slot-scope="scope">
                            <p>{{scope.row.comment || '-'}}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="bottom">
                <el-table :data="teamM" size="small" border>
                    <el-table-column label="部門" prop="teamName"></el-table-column>
                    <el-table-column label="部門リーダー" prop="teamLeader"></el-table-column>
                    <el-table-column label="配属開始日">
                        <template slot-scope="scope">
                            <p>{{formatTime(scope.row.fromDate)}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="配属終了日">
                        <template slot-scope="scope">
                            <p>{{formatTime(scope.row.toDate)}}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="disbleds" v-if="isDisplay">
            <div class="imgid" v-if='imgIds.length>0'>
                <div v-for="(item, index) in imgIds" :key='index'>
                    <img :src="item.url">
                </div>
            </div>
        </div>
        <el-dialog title="被扶養者" :visible.sync="visible" @close="close" class="csstable">
            <el-table :data="forms" size="small" border>
                <el-table-column label="氏名（カタカナ）" prop="dependantFurigana">
                    <template slot-scope="scope">
                        <el-input v-if='!isDisplay' v-model="scope.row.dependantFurigana" :maxlength="20"></el-input>
                        <span v-else>{{scope.row.dependantFurigana}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="氏名（漢字）" prop="dependantName">
                    <template slot-scope="scope">
                        <el-input v-if='!isDisplay' v-model="scope.row.dependantName" :maxlength="20"></el-input>
                        <span v-else>{{scope.row.dependantName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="関係" prop="relation">
                    <template slot-scope="scope">
                        <el-select v-if='!isDisplay' v-model="scope.row.relation" filterable allow-create default-first-option @change="selectBlur(scope.row, scope.$index)">
                            <el-option v-for="item in selation" :key="item.id" :value="item.id" :label="item.text"></el-option>
                        </el-select>
                        <span v-else>{{getContent(scope.row.relation, selation, 'id', 'text')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="生年月日" prop="dependantBirthday" width="150px">
                    <template slot-scope="scope">
                        <el-date-picker
                            v-if='!isDisplay'
                            class="ces"
                            v-model="scope.row.dependantBirthday"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
                        <span v-else>{{formatTime(scope.row.dependantBirthday)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="性別" prop="dependantSex" width="85px">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.dependantSex" v-if='!isDisplay'>
                            <el-option v-for="(item, i) in sexs" :key="i" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                        <span v-else>{{getContent(scope.row.dependantSex, sexs, 'value', 'label')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="住所" prop="dependantAddress">
                    <template slot-scope="scope">
                        <el-input v-if='!isDisplay' v-model="scope.row.dependantAddress" :maxlength="100"></el-input>
                        <span v-else>{{scope.row.dependantAddress}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="同居" prop="liveTogether" width="50px">
                    <template slot-scope="scope">
                        <el-checkbox v-if='!isDisplay' v-model="scope.row.liveTogether"></el-checkbox>
                        <span v-else>{{scope.row.liveTogether?'是':'否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="50px" v-if='!isDisplay'>
                    <template slot-scope="scope">
                        <el-tooltip class="flot" effect="dark" content="削除" placement="top-start">
                            <i class="el-icon-delete oper-icon" color="danger" @click="deletes(scope.$index)"></i>
                        </el-tooltip>
                    </template>  
                </el-table-column>
            </el-table>
            <div slot="footer" v-if='!isDisplay'>
                <el-button type="primary" size="small" @click="savesubmit">保存</el-button>
            </div>
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import moment from 'moment';
import { mapGetters } from 'vuex';
import CardUpload from '@components/card-upload';
import { priceToString, formatTime, fileToBase64} from '@_public/utils';

export default {
    components: {
        MainWrapper,
        CardUpload
    },
    data() {
        return {
            visible: false,
            istrue: false,
            teamM: [],
            countryTypeArr: [],
            forms: [],
            form: {
                employeeTypeID: '',
                vendorID: '',
                liveCity: '',
                name: '',
                furigana: '',
                onBoardDate: '',
                sex: true,
                birthday: '',
                nationality: '',
                station: '',
                mainSkill: '',
                startworkdate: '',
                position: '',
                arrivejpdate: '',
                teamMembers: '',
                jpLangCert: '',
                jpLangComt: '',
                enLangComt: '',
                certificates: [],
                PJSalary: '',
                BaseSalary: '',
                SComment: '',
                salepricefrom: '',
                salePriceTo: '',
                travel: '',
                expectPJ: '',
                comment: ''
            },
            rules: {
                salePriceFrom: [{
                    required: true, message: '请输入提案単価', trigger: 'blur'
                }],
                PJSalary: [{
                    required: true, message: '请输入绩效工资', trigger: 'blur'
                }],
                startWorkDate: [{
                    required: true, message: '请输入经验年数', trigger: 'blur'
                }],
                positionID: [{
                    required: true, message: '请输入', trigger: 'blur'
                }],
                furigana_FirstName: [{
                    required: true, message: '请输入姓', trigger: 'blur'
                }],
                furigana_LastName: [{
                    required: true, message: '请输入名', trigger: 'blur'
                }],
                pinYin_FirstName: [{
                    required: true, message: '请输入姓', trigger: 'blur'
                }],
                pinYin_LastName: [{
                    required: true, message: '请输入名', trigger: 'blur'
                }],
                employeeTypeID: [{
                    required: true, message: '请选择就职类型', trigger: 'blur'
                }],
                liveCity: [{
                    required: true, message: '请选择常住都市', trigger: 'blur'
                }],
                firstName: [{
                    required: true, message: '请输入姓', trigger: 'blur'
                }],
                lastName: [{
                    required: true, message: '请输入名', trigger: 'blur'
                }],
                onBoardDate: [{
                    required: true, message: '请选择入职时间', trigger: 'blur'
                }],
                sex: [{
                    required: true, message: '请选择性别', trigger: 'blur'
                }],
                birthday: [{
                    required: true, message: '请选择生日', trigger: 'blur'
                }],
                nationality: [{
                    required: true, message: '请选择国籍', trigger: 'blur'
                }],
                station: [{
                    required: true, message: '请输入最近车站', trigger: 'blur'
                }],
                mainSkill: [{
                    required: true, message: '请输入模块', trigger: 'blur'
                }],
                startworkdate: [{
                    required: true, message: '请选择SAP经验开始日', trigger: 'blur'
                }],
                position: [{
                    required: true, message: '请选择岗位', trigger: 'blur'
                }],
                arrivejpdate: [{
                    required: true, message: '请选择来日时间', trigger: 'blur'
                }],
                teamMembers: [{
                    required: true, message: '请选择所属部门', trigger: 'blur'
                }]
            },
            isEdit: false,
            isDisplay: false,
            emptyTip: false,
            errorTip: false,
            employeeTypes: [],
            cityTypes: [],
            sexs: [{
                label: '男', value: true
            }, {
                label: '女', value: false
            }],
            jpLangs: [{
                label: '1级', value: 1
            }, {
                label: '2级', value: 2
            }, {
                label: '3级', value: 3
            }],
            teams: [],
            positions: [],
            certificates: [],
            ishight: true,
            isEmplooe: false,
            vendorsArr: [],
            employeeImages: [],
            employeePersonID: 0,
            data1: '',
            selation: [],
            imgIds: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (Number(to.params.id)) {
                console.log(to.params.id);
                vm.getInfos(to.params.id);
                if (to.query.display) {
                    vm.isDisplay = true;
                }
                vm.getFuyang();
                vm.getReslion();
                vm.getData();
            }
            vm.getTeams();
            vm.countryType();
            vm.getEmployeeTypes();
            vm.getCityTypes();
            vm.getPositions();
            vm.getCertificates();
            vm.getVendors();
        });
    },
    computed: {
        ...mapGetters([ 'IS_H5' ])
    },
    methods: {
        priceToString: priceToString,
        formatTime: formatTime,
        selectBlur(e, id) {
            this.forms.forEach((item, index) => {
                if(id === index) {
                    if (typeof(e.relation) === 'string') {
                        item.otherRelation = e.relation;
                    } else {
                        item.otherRelation = '';
                    }
                }
            });
        },
        deletes(index) {
            this.forms.forEach((item, inde) => {
                if (index === inde) {
                    this.forms.splice(index, 1);
                }
            });
        },
        getReslion() {
            this.$axios({
                url: '/api/Employee/api_dependantrelationforselect',
                custom: {
                    vm: this
                }
            }).then(res => {
                if (res && res.code === 0) {
                    this.selation = res.data;
                }
            });
        },
        getFuyang() {
            this.$axios({
                url: '/api/Employee/api_getdependants',
                params: {
                    empeeid: this.$route.params.id
                },
                custom: {
                    vm: this
                }
            }).then(res => {
                if (res && res.code === 0) {
                    if (res.data.length > 0) {
                        this.forms = res.data;
                    } else {
                        this.forms = [{
                            dependantAddress: '',
                            dependantBirthday: '',
                            dependantFurigana: '',
                            dependantName: '',
                            dependantSex: '',
                            liveTogether: '',
                            relation: '',
                            otherRelation: ''
                        }];
                    }
                }
            });
        },
        close() {
            this.visible = false;
            this.getFuyang();
        },
        savesubmit() {
            let btns = false;
            this.forms.forEach(item => {
                if (item.otherRelation !== '') {
                    item.relation = 0;
                }
                if (item.dependantFurigana !== '' && item.dependantName !== '' && item.relation !== '' && item.dependantAddress !== '') {
                    btns = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: '请输入氏名（カタカナ）,氏名（漢字）,関係,住所'
                    });
                }
                // if (item.dependantName === '') {
                //     this.$message({
                //         type: 'error',
                //         message: '请输入氏名（漢字）'
                //     });
                // } else if (item.dependantAddress === '') {
                //     this.$message({
                //         type: 'error',
                //         message: '请输入住所'
                //     });
                // } else {
                //     btns = true;
                // }
            });
            if (this.forms.length === 0) {
                btns = true;
            }
            if (btns === true) {
                const loading = this.$loading({ lock: true, text: '正在提交入职资料中...' });
                this.$axios({
                    method: 'POST',
                    url: '/api/Employee/api_updatedependants',
                    params: {
                        dependants: this.forms,
                        empeeid: this.$route.params.id
                    },
                    formData: true
                }).then(res => {
                    loading.close();
                    if (res && res.code === 0) {
                        this.visible = false;
                        this.$message({
                            type: 'success',
                            showClose: true,
                            message: '保存成功'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            showClose: true,
                            message: res.message ? res.message : '接口开小差了，没有返回信息'
                        });
                    }
                });
            }
        },
        getData() {
            const loading = this.$loading({ lock: true, text: 'データ取得中...' });
            this.$axios({
                url: '/api/Employee/api_getemployeeinfo',
                params: {
                    id: this.$route.params.id
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                this.isEdit = true;
                if (res && res.code === 0) {
                    this.formatResultData(res.data || {});
                } else {
                    this.$message({
                        type: 'error',
                        message: (res && res.message) || '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        formatResultData(data) {
            const formatTime = time => moment(time).format('YYYY-MM-DD');
            const form = { ...data };
            form.onBoardDate = data.onBoardDate && formatTime(data.onBoardDate);
            form.birthday = data.birthday && formatTime(data.birthday);
            form.startWorkDate = data.startWorkDate && formatTime(data.startWorkDate);
            form.arriveJPDate = data.arriveJPDate && formatTime(data.arriveJPDate);
            form.certificates = data.certificates && data.certificates.map(item => item.certificateID);
            if (form.jpLangCert === 0) {
                form.jpLangCert = '';
            }
            // if (data.salaries && data.salaries.length) {
            //     const sales = data.salaries[0];
            //     form.PJSalary = sales.pjSalary;
            //     form.BaseSalary = sales.baseSalary;
            //     form.SComment = sales.comment;
            // }
            form.salaries = data.salaries || [];
            this.teamM = data.teamMembers || [];
            this.form = { ...form };
        },
        selsectNation(id) {
            if (id === 0) {
                this.ishight = false;
            } else {
                this.ishight = true;
            }
        },
        selsectEmployee(ids) {
            this.employeeTypes.forEach(item => {
                if (item.id === ids) {
                    console.log(item);
                    if (item.type === 2) {
                        this.isEmplooe = true;
                    } else {
                        this.isEmplooe = false;
                        this.form.vendorID = 0;
                    }
                }
            });
        },
        // 部门
        getVendors() {
            this.$axios({
                url: '/api/Customer/api_vendorsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.vendorsArr = res.data || [];
                }
            });
        },
        // 部门
        getTeams() {
            this.$axios({
                url: '/api/Team/api_teamsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.teams = res.data || [];
                }
            });
        },
        // 国籍列表
        countryType() {
            this.$axios({
                url: '/api/Candidate/api_nationalityforselect'
            }).then(res => {
                this.countryTypeArr = res.data;
            });
        },
        // 就职类型
        getEmployeeTypes() {
            this.$axios({
                url: '/api/Employee/api_employeetypesforselect'
            }).then(res => {
                if (res.data) {
                    this.employeeTypes = res.data || [];
                }
            });
        },
        // 城市
        getCityTypes() {
            this.$axios({
                url: '/api/Candidate/api_cityforselect'
            }).then(res => {
                if (res.data) {
                    this.cityTypes = res.data || [];
                }
            });
        },
        // 岗位
        getPositions() {
            this.$axios({
                url: '/api/Position/api_positionsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.positions = res.data || [];
                }
            });
        },
        // SAP认证资格
        getCertificates() {
            this.$axios({
                url: '/api/Certificate/api_certificatesforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.certificates = res.data || [];
                }
            });
        },
        validSalePrice() {
            this.errorTip = false;
            this.emptyTip = false;
            if (this.form.salePriceFrom && this.form.salePriceTo) {
                let priceFrom = this.form.salePriceFrom.replace(/,/g, '');
                let priceTo = this.form.salePriceTo.replace(/,/g, '');
                if (Number(priceFrom) > Number(priceTo)) {
                    this.errorTip = true;
                } else {
                    this.errorTip = false;
                }
            } else {
                this.errorTip = false;
            }
            if (this.form.PJSalary && this.form.BaseSalary) {
                let priceFrom = this.form.PJSalary.replace(/,/g, '');
                let priceTo = this.form.BaseSalary.replace(/,/g, '');
                if (Number(priceFrom) > Number(priceTo)) {
                    this.emptyTip = true;
                } else {
                    this.emptyTip = false;
                }
            } else {
                this.emptyTip = false;
            }
        },
        formatPrice(key) {
            let value = this.form[key];
            if (!value) return false;
            if (key === 'PJSalary' || key === 'BaseSalary') {
                this.emptyTip = false;
            }
            value = value.replace(/,/g, '');
            if (value.indexOf('.') > -1) {
                this.form[key] = parseInt(value).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            } else {
                this.form[key] = value.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            }
        },
        resetForm() {
            // this.$refs.from.resetFields();
            this.visible = true;
        },
        beforeSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (this.errorTip) return false;
                    if (!this.isEdit && !this.form.PJSalary && !this.form.BaseSalary) {
                        this.emptyTip = true;
                        return false;
                    }
                    let params = {};
                    let type = 'Employee/api_employeeonboard';
                    if (this.isEdit) {
                        params = this.getSubmitParams('edit');
                        type = 'Employee/api_updateemployee';
                    } else {
                        params = this.getSubmitParams();
                    }
                    const formData = new FormData();
                    for (let key in params) {
                        if (params[key] && typeof params[key] === 'object') {
                            params[key].forEach((item, i) => {
                                for (let k in item) {
                                    formData.append(`${key}[${i}].${k}`, item[k]);
                                }
                            });
                        } else {
                            formData.append(key, params[key]);
                        }
                    }
                    this.submit(formData, type);
                } else {
                    this.$message({
                        type: 'warning',
                        message: '必須項目を入力してください！'
                    });
                }
            });
        },
        getSubmitParams(type) {
            // this.form.nationality = this.getContent(this.form.nationality, this.countryTypeArr, 'id', 'text');
            let params = {
                'Certificates': this.form.certificates.map(item => ({
                    certificateID: item,
                    passDate: '2020-01-01'
                })),
                'TeamMembers': '',
                'CandidateID': this.form.candidateID || 0,
                'EmployeeTypeID': this.form.employeeTypeID,
                'VendorID': this.form.vendorID || 0,
                'OnBoardDate': this.form.onBoardDate,
                'Furigana_FirstName': this.form.furigana_FirstName || '',
                'Furigana_LastName':  this.form.furigana_LastName || '',
                'PinYin_FirstName': this.form.pinYin_FirstName || '',
                'PinYin_LastName':  this.form.pinYin_LastName || '',
                'FirstName': this.form.firstName || '',
                'LastName': this.form.lastName || '',
                'Sex': this.form.sex,
                'Birthday': this.form.birthday,
                'Nationality': this.form.nationality,
                'LiveCity': this.form.liveCity || '',
                'Station': this.form.station,
                'MainSkill': this.form.mainSkill,
                'StartWorkDate': this.form.startWorkDate,
                'PositionID': this.form.positionID,
                'ArriveJPDate': this.form.arriveJPDate || moment(new Date()).format('YYYY-MM-DD'),
                'JPLangCert': this.form.jpLangCert || 0,
                'JPLangComt': this.form.jpLangComt || '',
                'ENLangComt': this.form.enLangComt || '',
                'SalePriceFrom': Number(this.form.salePriceFrom.toString().replace(/,/g, '')) || 0,
                'SalePriceTo': Number(this.form.salePriceTo.toString().replace(/,/g, '')) || 0,
                'Travel': this.form.travel || '',
                'ExpectPJ': this.form.expectPJ || '',
                'Comment': this.form.comment || ''
                // 'BaseSalary': priceToNumber(this.form.BaseSalary),
                // 'PJSalary': priceToNumber(this.form.PJSalary),
                // 'SComment': this.form.SComment
            };
            if (this.form.teamMembers instanceof Array) {
                params.TeamMembers = this.form.teamMembers.map(item => ({teamID: item.id}));
            } else {
                params.TeamMembers = [{teamID: this.form.teamMembers}];
            }
            if (type === 'edit') {
                params.ID = this.$route.params.id;
            } else {
                params['Salaries'] = [{
                    PJSalary: Number(this.form.PJSalary.toString().replace(/,/g, '')),
                    BaseSalary: Number(this.form.BaseSalary.toString().replace(/,/g, '')),
                    Comment: this.form.SComment,
                }];
            }
            console.log(params);
            return params;
        },
        submit(formData, api) {
            console.log(formData, api);
            const loading = this.$loading({ lock: true, text: '正在提交入职资料中...' });
            this.$axios({
                method: 'POST',
                url: `/api/${api}`,
                params: formData,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.$message({
                        type: 'success',
                        showClose: true,
                        message: '保存成功'
                    });
                    this.$router.push({ name: 'EmployeeList' });
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        getContent(val, arr, key, field) {
            for (let item of arr) {
                if (item[key] === val) {
                    return item[field];
                }
            }
            return '-';
        },
        getCerts() {
            const arr = [];
            this.certificates.forEach(item => {
                if (this.form.certificates.includes(item.id)) {
                    arr.push(item.certName);
                }
            });
            return arr.join('，');
        },
        dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(","),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        },
        upload({res}) {
            let optid = 0;
            // if(this.employeeImages.length > 0) {
            //     optid = this.employeeImages[0].id;
            // }
            this.$axios({
                method: 'POST',
                url: '/api/Employee/api_uploadempeeimage',
                params: {
                    empeeid: this.employeePersonID,
                    imageid: optid,
                    image: res.file
                },
                formData: true
            }).then(res => {
                console.log(res);
            });
            // fileToBase64(res.file).then(result => {
            //     this.form[opt.field] = this.dataURLtoFile(result, opt.field);
            // });
        },
        deleteimage(opts) {
            const loading = this.$loading({ lock: true, text: '正在删除中...' });
            this.$axios({
                url: '/api/Employee/api_deleteempeeimage',
                params: {
                    empeeid: this.employeePersonID,
                    imageid: opts
                }
            }).then(res => {
                loading.close();
                this.$message({
                    type: 'success',
                    showClose: true,
                    message: res.message
                });
            });
        },
        getInfos(ids) {
            this.$axios({
                url: '/api/Employee/api_getemployeeinfo',
                params: {
                    id: ids
                }
            }).then(res => {
                this.employeeImages = res.data.employeeImages;
                this.employeePersonID = res.data.id;
                if (this.employeeImages.length > 0) {
                    this.employeeImages.forEach(item => {
                        this.getLogo(item.id);
                    });
                } else {
                    this.istrue = true;
                }
            });
        },
        getLogo(ids) {
            let opts = ids;
            this.$axios({
                url: '/api/Employee/api_getempeeimage',
                params: {
                    imageid: ids
                },
                headers: {
                    'Content-Type': 'application/octet-stream'
                },
                responseType: 'blob'
            }).then(res => {
                fileToBase64(res).then(result => {
                    if (result.indexOf('image') > -1) {
                        this.data1 = result;
                        let optimg = {
                            url: result,
                            id: opts
                        };
                        this.imgIds.push(optimg);
                    }
                    this.istrue = true;
                });
            });
        }
    }
};
</script>

<style lang="less">
.employee-edit {
    .imgid{
        width: 100%;
        div{
            border-radius: 3px;
            border: 1px solid #C1D4E5;
            position: relative;
            width: 200px;
            float: left;
            margin-right: 20px;
            margin-bottom: 20px;
            img{
                width: 190px;
            }
            .posis{
                position: absolute;
                top: 5px;
                right: 5px;
                cursor: pointer;
            }
        }
    }
    .content-wrapper{
        overflow: hidden;
    }
    .minwidth{
        min-width: 1200px;
    }
    .disbled{
        float: left;
        overflow: hidden;
        width: 900px;
    }
    .disbleds{
        float: right;
        width: calc(100% - 920px);
        margin-top: 20px;
        img{
            width: 200px;
            margin-right: 20px;
        }
    }
    .bottom{
        margin-top: 20px;
        ul{
            width: 900px;
            overflow: hidden;
            // height: 280px;
            border: 1px solid #EBEEF5;
            border-top: none;
            li{
                width: 50%;
                float: left;
                height: 50px;
                line-height: 50px;
                border-top: 1px solid #EBEEF5;
                span{
                    color: #606266;
                    float: left;
                    padding: 0 10px;
                    box-sizing: border-box;
                }
                span:first-child{
                    width: 145px;
                    background-color: #F5F7FA;
                }
                span:last-child{
                    width: 300px;
                    overflow:hidden;  /*超过部分不显示*/
                    text-overflow:ellipsis;  /*超过部分用点点表示*/
                    white-space:nowrap; /*不换行*/
                }
            }
            .lis{
                border-bottom: 1px solid #EBEEF5;
            }
        }
    }
    .el-form {
        .el-form-item {
            margin-bottom: 20px;
        }
        .el-date-editor, .el-select {
            width: 220px;
        }
        .el-input {
            width: 220px;
        }
        [color~=danger] {
            position: absolute;
            top: 100%;
            left: 0;
            font-size: 12px;
            height: 12px;
            line-height: 16px;
        }
        .error-input {
            input {
                border-color: #DB414E;
            }
        }
    }
}
</style>
