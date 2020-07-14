import Vue from 'vue'
import Router from 'vue-router'

// const Charge = r => require.ensure([], () => r(require('@/components/Charge')))
// const User = r => require.ensure([], () => r(require('@/components/User')))
// const SelfPay = r => require.ensure([], () => r(require('@/components/SelfPay')))
// const Cashier = r => require.ensure([], () => r(require('@/components/Cashier')))
// const RewardList = r => require.ensure([], () => r(require('@/components/RewardList')))

// const Exchange = r => require.ensure([], () => r(require('@/components/Exchange')))
// const Mall = r => require.ensure([], () => r(require('@/components/Mall')))
// const MallDetail = r => require.ensure([], () => r(require('@/components/MallDetail')))
// const MallRecord = r => require.ensure([], () => r(require('@/components/MallRecord')))
// const Coupon = r => require.ensure([], () => r(require('@/components/Coupon')))
// const Payment = r => require.ensure([], () => r(require('@/components/Payment')))
// const Guide = r => require.ensure([], () => r(require('@/components/guide')))
// const Strategy = r => require.ensure([], () => r(require('@/components/Strategy')))
// const Setting = r => require.ensure([], () => r(require('@/components/Setting')))
// const Reward = r => require.ensure([], () => r(require('@/components/Reward')))
// const Vip = r => require.ensure([], () => r(require('@/components/Vip')))
// const Activity = r => require.ensure([], () => r(require('@/components/Activity')))
// const UserLine = r => require.ensure([], () => r(require('@/components/UserLine')))
// const UserReserve = r => require.ensure([], () => r(require('@/components/UserReserve')))
// const Saler = r => require.ensure([], () => r(require('@/components/Saler')))

// //无入口
// const CouponUse = r => require.ensure([], () => r(require('@/components/CouponUse')))
// const Error = r => require.ensure([], () => r(require('@/components/Error')))
// const More = r => require.ensure([], () => r(require('@/components/More')))
// const Upgrade = r => require.ensure([], () => r(require('@/components/Upgrade')))
// const GrouponInfo = r => require.ensure([], () => r(require('@/components/GrouponInfo')))
// const Groupon = r => require.ensure([], () => r(require('@/components/Groupon')))
// const Gift = r => require.ensure([], () => r(require('@/components/Gift')))
// const Paymentee = r => require.ensure([], () => r(require('@/components/Paymentee')))

// //test
// const Login = r => require.ensure([], () => r(require('@/components/Login')))
// const Test = r => require.ensure([], () => r(require('@/components/Test')))
// const Index = r => require.ensure([], () => r(require('@/components/Index')))
// const Promote = r => require.ensure([], () => r(require('@/components/Promote')))
const Charge = () =>import('@/components/Charge');
const User = () =>import('@/components/User');
const SelfPay = () =>import('@/components/SelfPay');
const Cashier = () =>import('@/components/Cashier');
const RewardList = () =>import('@/components/RewardList');

const Exchange = () =>import('@/components/Exchange');
const Mall = () =>import('@/components/Mall');
const MallDetail = () =>import('@/components/MallDetail');
const MallRecord = () =>import('@/components/MallRecord');
const Coupon = () =>import('@/components/Coupon');
const Payment = () =>import('@/components/Payment');
const Guide = () =>import('@/components/guide');
const Strategy = () =>import('@/components/Strategy');
const Setting = () =>import('@/components/Setting');
const Reward = () =>import('@/components/Reward');
const Vip = () =>import('@/components/Vip');
const Activity = () =>import('@/components/Activity');
const UserLine = () =>import('@/components/UserLine');
const UserReserve = () =>import('@/components/UserReserve');
const Saler = () =>import('@/components/Saler');

//无入口
const CouponUse = () =>import('@/components/CouponUse');
const Error = () =>import('@/components/Error');
const More = () =>import('@/components/More');
const Upgrade = () =>import('@/components/Upgrade');
const GrouponInfo = () =>import('@/components/GrouponInfo');
const Groupon = () =>import('@/components/Groupon');
const Gift = () =>import('@/components/Gift');
const Paymentee = () =>import('@/components/Paymentee');

//test
const Login = () =>import('@/components/Login');
const Test = () =>import('@/components/Test');
const Index = () =>import('@/components/Index');
const Promote = () =>import('@/components/Promote');

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
    },{
      path: '/promote',
      name: 'Promote',
      component: Promote,
    }, 
    {
      path: '/payment',
      name: 'Payment',
      component: Payment,
    },
    {
      path: '/strategy',
      name: 'Strategy',                      
      component: Strategy,
    },
    {
      path: '/charge',
      name: 'Charge',
      component: Charge
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/selfPay',
      name: 'SelfPay',
      component: SelfPay
    },
    {
      path: '/cashier',
      name: 'Cashier',
      component: Cashier
    },
    {
      path: '/more',
      name: 'More',
      alias: '/brand',
      component: More
    },
    {
      path: '/user',
      name: 'User',
      alias: '/my',
      component: User
    },
    {
      path: '/rewardlist',
      name: 'RewardList',
      component: RewardList
    },
    {
      path: '/vip',
      name: 'Vip',
      component: Vip
    },
    {
      path: '/activity',
      name: 'Activity',
      component: Activity
    }, {
      path: '/setting',
      name: 'Setting',
      component: Setting
    },
    {
      path: '/exchange',
      name: 'Exchange',
      component: Exchange
    }, {
      path: '/reward',
      name: 'Reward',
      component: Reward
    }, {
      path: '/userReserve',
      name: 'UserReserve',
      component: UserReserve
    }, {
      path: '/userLine',
      name: 'UserLine',
      component: UserLine
    },
    {
      path: '/upgrade',
      name: 'Upgrade',
      component: Upgrade
    },
    {
      path: '/grouponInfo',
      name: 'GrouponInfo',
      component: GrouponInfo
    },
    {
      path: '/mall',
      name: 'Mall',
      component: Mall
    },
    {
      path: '/mallDetail',
      name: 'MallDetail',
      component: MallDetail,
      meta:{
        title:"商品详情"
      }
    },
    {
      path: '/mallRecord',
      name: 'MallRecord',
      component: MallRecord
    },
    {
      path: '/coupon',
      name: 'Coupon',
      component: Coupon,
    },
    {
      path: '/groupon',
      name: 'Groupon',
      component: Groupon
    },
    {
      path: '/error',
      name: 'Error',
      component: Error
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/gift',
      name: 'Gift',
      component: Gift
    },
    {
      path: '/paymentee',
      name: 'Paymentee',
      component: Paymentee
    },
    {
      path: '/couponUse',
      name: 'CouponUse',
      component: CouponUse
    },
    {
      path: '/guide',
      name: 'guide',
      component: Guide
    },
    {
      path: '/saler',
      name: 'saler',
      component: Saler
    }
  ]
})
