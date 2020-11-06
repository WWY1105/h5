import Vue from 'vue'
import Router from 'vue-router'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}


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
const CouponActivity = () =>import('@/components/CouponActivity');
const CouponDetail = () =>import('@/components/CouponDetail');
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
const Dynamic= () =>import('@/components/Dynamic');
//无入口
const CouponUse = () =>import('@/components/CouponUse');
const Error = () =>import('@/components/Error');
const More = () =>import('@/components/More');
const Upgrade = () =>import('@/components/Upgrade');
const GrouponInfo = () =>import('@/components/GrouponInfo');
const Groupon = () =>import('@/components/Groupon');
const Gift = () =>import('@/components/Gift');
const Paymentee = () =>import('@/components/Paymentee');
const QuickPay = () =>import('@/components/QuickPay');

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
      path: '/dynamic',
      name: 'Dynamic',
      component: Dynamic,
      meta:{
        title:'您的专属客服'
      }
    }, {
      path: '/error',
      name: 'Error',
      component: Error,
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
      path: '/couponActivity',
      name: 'CouponActivity',
      component: CouponActivity,
    },
    {
      path: '/couponDetail',
      name: 'CouponDetail',
      component: CouponDetail,
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
    },
    {
      path: '/quickPay',
      name: 'quickPay',
      component: QuickPay
    }
  ]
})
