<template>
    <el-dialog
        title="タグ管理"
        custom-class="tag-dialog"
        ref="tagDialog"
        :visible="visible"
        v-loading="loading"
        @close="close">
        <el-tag
            :key="tag.id"
            v-for="tag in tags"
            closable
            :disable-transitions="false"
            @close="deleteTag(tag)">
            <el-input
                v-if="curTag.id === tag.id"
                v-model="curTag.tagName"
                size="mini"></el-input>
            <span v-else style="margin-right: 5px;">{{tag.tagName}}</span>
            <el-button v-if="curTag.id === tag.id" size="mini" @click="updateTag('edit')">保存</el-button>
            <i v-if="curTag.id === tag.id" class="el-icon-view" @click="cancelEdit"></i>
            <i v-else class="el-icon-edit-outline" @click="curTag = { ...tag }"></i>
        </el-tag>
        <el-input
            v-if="inputVisible"
            v-model="newTagName"
            size="mini"
            placeholder="エンター保存"
            @keyup.enter.native="updateTag('add')">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="inputVisible = true;newTagName = ''">新規登録</el-button>
    </el-dialog>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            tags: [],
            inputVisible: false,
            newTagName: '',
            curTag: {
                id: '',
                tagName: ''
            },
            loading: false
        };
    },
    watch: {
        visible: function(val) {
            if (val) {
                this.getTags();
            }
        }
    },
    methods: {
        close() {
            this.$emit('close');
            this.newTagName = '';
            this.curTag = {
                id: '',
                tagName: ''
            };
            this.inputVisible =  false;
        },
        getTags() {
            this.$axios({
                url: '/api/Opportunity/api_getopportunitytaglist'
            }).then(res => {
                if (res && res.code === 0) {
                    this.tags = res.data || [];
                }
            });
        },
        deleteTag(tag) {
            this.$confirm('削除確認', '削除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '/api/Opportunity/api_deleteopportunitytag',
                    params: {
                        id: tag.id
                    }
                }).then(res => {
                    if (res && res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '削除完了！'
                        });
                        this.getTags();
                        this.$emit('updateTag');
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.message
                        });
                    }
                });
            }).catch(() => {});
        },
        updateTag(type) {
            let tagName = '';
            if (type === 'add') {
                tagName = this.newTagName;
            } else {
                tagName = this.curTag.tagName;
            }
            if (tagName) {
                const params = {
                    TagName: tagName,
                    ID: 0
                };
                if (type === 'edit') {
                    params.ID =  this.curTag.id;
                }
                this.$axios({
                    method: 'POST',
                    url: '/api/Opportunity/api_updateopportunitytag',
                    params,
                    formData: true
                }).then(res => {
                    if (res && res.code === 0) {
                        if (type === 'add') {
                            this.inputVisible = false;
                        }
                        this.getTags();
                        this.$emit('updateTag');
                    }
                });
            }
        },
        showInput() {
            this.tagName = '';
            this.inputVisible = true;
        },
        cancelEdit() {
            this.curTag = {
                id: '',
                tagName: ''
            };
        }
    }
};
</script>

<style lang="less">
.tag-dialog {
    .el-tag {
        margin-right: 10px;
        margin-bottom: 10px;
        .el-input {
            width: 60%;
            margin-right: 10px;
        }
        .el-button {
            margin-right: 10px;
        }
        .el-icon-edit-outline, .el-icon-edit-outline {
            cursor: pointer;
        }
    }
}
</style>
