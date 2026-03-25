import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import NftView from '../views/NftView.vue';
import FriendsView from '../views/FriendsView.vue';
import CooperationView from '../views/CooperationView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import { walletState } from '../services/wallet';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/nft',
    name: 'NFT',
    component: NftView,
  },
  {
    path: '/friends',
    name: 'Friends',
    component: FriendsView,
  },
  {
    path: '/cooperation',
    name: 'Cooperation',
    component: CooperationView,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;
