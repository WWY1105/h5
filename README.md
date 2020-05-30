# menu

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

##install vue-cli
1. 使用淘宝镜像

    ```
    npm install -g cnpm --registry=https://registry.npm.taobao.org
    ```
2. 如果安装失败请尝试清一下缓存再安装
    ```
    npm cache clean
    ```
3. 安装 webpack vue-cli
    ```
    cnpm install -g vue-cli
    cnpm install -g webpack
    ```
4. 构建项目
    ```
    vue init webpack menu
    ```
5. git安装位置
    ```
    which git
    ```
###查看log
 ```
ssh:47.96.190.4
tail -f /alidata/www/mws/logs/catalina.out 
tail -f /alidata/www/bm/logs/catalina.out 
 ```
###server  bug fix

npm ERR! Failed at the dev@1.0.0 dev script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
 ```
npm i -D webpack-dev-server@2.9.7
 ```
 ### pull最新版本
 git pull origin master
 
 ### webstorm 注册机
  ```
http://idea.wrbugtest.tk/    
https://idea.ouyanglol.com/
  ```
 ### vue transition 出不来的原因
  ```
<transition appear></transition>
  ```


