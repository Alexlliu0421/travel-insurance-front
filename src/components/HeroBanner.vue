<script setup lang="ts">
import { useScrollTo } from '../composables/useScrollTo'

const { scrollToSection } = useScrollTo()
</script>

<template>
  <div class="hero-banner row items-center q-px-xl" style="min-height: 480px; background-color: #f0f7f4;">
    <div class="col-12 col-md-6">
      <div class="text-h3 text-weight-bold q-mb-md">
        陪你安心出發<br />每一段旅程
      </div>
      <div class="text-subtitle1 text-grey-7 q-mb-lg">
        最低保費起，享有全面意外與海外突發疾病保障，線上投保，立即生效。
      </div>
      <q-btn color="primary" label="立即試算" size="lg" class="q-mr-md" @click="scrollToSection('quote-section')" />
      <q-btn outline color="primary" label="了解旅平險" size="lg" @click="scrollToSection('product-intro')" />
    </div>
    <div class="col-12 col-md-6 text-center">
      <q-icon name="flight" size="200px" color="primary" />
    </div>
  </div>
</template>