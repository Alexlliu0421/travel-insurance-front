<script setup lang="ts">
const features = [
  { icon: 'health_and_safety', title: '意外身故/失能保障', desc: '旅途中發生意外事故，依約定保額給付保險金' },
  { icon: 'local_hospital', title: '海外突發疾病醫療', desc: '海外突發疾病就醫，依約定保額給付保險金' },
  { icon: 'verified_user', title: '保額彈性選擇', desc: '提供 100萬至1000萬元保額方案，依需求投保' },
  { icon: 'speed', title: '線上即時試算', desc: '輸入旅遊資訊，立即試算保費，快速投保' },
]
</script>

<template>
  <div id="product-intro" class="q-px-xl q-py-xl">
    <div class="text-h4 text-weight-bold text-center q-mb-md">e悠遊旅行平安險</div>
    <div class="text-subtitle1 text-grey-7 text-center q-mb-xl">
      一張保單，涵蓋意外、醫療多重保障
    </div>

    <div class="row q-col-gutter-lg justify-center">
      <div v-for="f in features" :key="f.title" class="col-12 col-md-3">
        <q-card flat bordered class="q-pa-md text-center" style="height: 100%;">
          <q-icon :name="f.icon" size="48px" color="primary" class="q-mb-sm" />
          <div class="text-subtitle1 text-weight-bold q-mb-xs">{{ f.title }}</div>
          <div class="text-caption text-grey-7">{{ f.desc }}</div>
        </q-card>
      </div>
    </div>
  </div>
</template>