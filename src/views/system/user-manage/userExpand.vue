<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col span="8">
        <span class="expand-key">昵称: </span>
        <span class="expand-value">{{ row.nickName }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">个人简介: </span>
        <span class="expand-value">{{ row.introduction }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">所在城市: </span>
        <span class="expand-value">{{ row.birthday }}</span>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <span class="expand-key">详细地址: </span>
        <span class="expand-value">《{{ row.address }}》</span>
      </Col>
      <Col span="8">
        <span class="expand-key">密码强度: </span>
        <span class="expand-value">{{ row.passStrengh }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">账户是否锁定: </span>
        <span class="expand-value">{{ row.accountNonLocked }}</span>
      </Col>
    </Row>
  </div>
</template>
<script>
  export default {
    name: 'user-expend',
    props: {
      row: Object
    }
  }
</script>
