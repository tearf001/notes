
---
marp: true
---


```bash
echo '正在打标 sis'
docker tag sis artifact.srdcloud.cn/wh_rpt-release-docker-local/sis:$(date "+%y-%m-%d--%H-%M")
echo '正在推送 sis 到 研发云.'
# 时间格式作为标签
docker push artifact.srdcloud.cn/wh_rpt-release-docker-local/sis:$(date "+%y-%m-%d--%H-%M")
```

```bash
docker tag sis artifact.srdcloud.cn/wh_rpt-release-docker-local/sis
docker push artifact.srdcloud.cn/wh_rpt-release-docker-local/sis
```

第一次,需要登录 研发云仓库

```bash
docker login artifact.srdcloud.cn
# 带密码
docker login artifact.srdcloud.cn -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
```
> 账户密码获得 我的项目/制品/项目制品库
![image-20241211114323574](D:\typora-saves\研发云实操-from-scratch\image-20241211114323574.png)



