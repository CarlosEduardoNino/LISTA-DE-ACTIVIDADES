<template>
  <div class="hotel-homepage">
    <header class="header">
      <nav class="navigation">
        <router-link to="/" class="nav-item" exact>Actividades</router-link>
        <router-link to="/Agregar" class="nav-item">Agregar</router-link>
       
      </nav>
    </header>
    
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <component :is="Component" :key="$route.fullPath" />
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'instant'
  })
}

onMounted(scrollToTop)

watch(() => route.path, scrollToTop, { immediate: true })
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Great+Vibes&display=swap');

.hotel-homepage {
  font-family: 'Playfair Display', serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #0a0a0a;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
 
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  box-shadow: 0 2px 15px rgba(255, 215, 0, 0.1);
}

.logo-container {
  text-align: center;
  padding: 0 20px;

  .logo-image {
    height: 70px;
    margin-bottom: 5px;
  }

  .hotel-name {
    font-family: 'Great Vibes', cursive;
    font-size: 40px;
    font-weight: 400;
    color: #ffd700;
    margin: 0;
    letter-spacing: 1px;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    animation: golden-pulse 4s ease-in-out infinite;
  }
}

.navigation {
  display: flex;
  gap: 20px;

  .nav-item {
    text-decoration: none;
    color: #d4af37;
    font-weight: 400;
    font-size: 28px;
    font-style: italic;
    transition: all 0.3s ease;
    padding: 5px 10px;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #ffd700;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }

    &:hover, &.router-link-active {
      color: #ffd700;

      &::before {
        transform: translateX(0);
      }
    }
  }
}

.main-content {
  margin-top: 100px; 
  padding: 20px;
  color: #d4af37;
}

@keyframes golden-pulse {
  0%, 100% {
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6);
  }
}

@media (max-width: 1024px) {
  .header {
    flex-direction: column;
    padding: 10px;
  }

  .logo-container {
    order: -1;
    margin-bottom: 10px;
  }

  .navigation {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .main-content {
    margin-top: 150px;
  }
}
</style>