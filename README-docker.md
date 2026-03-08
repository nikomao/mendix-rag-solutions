# Docker 启动说明

这份说明用于把当前项目源码拷贝到一台安装了 Docker 的 Mac 上，并通过一键脚本直接启动。

启动后的访问地址：

`http://localhost:3009`

## 前提条件

需要先在 Mac 上安装并启动：

- Docker Desktop

确认 Docker 已经可用：

```bash
docker --version
docker compose version
```

## 首次使用

把整个项目目录拷贝到 Mac 后，先进入项目目录：

```bash
cd /你的路径/Mendix-RAG
```

如果第一次运行 `.command` 脚本，先给执行权限：

```bash
chmod +x ./*.command
```

如果 macOS 阻止脚本打开：

1. 在 Finder 里右键脚本
2. 选择“打开”
3. 在系统弹窗里再次确认“打开”

## 一键启动

双击下面这个文件，或在终端执行：

```bash
./docker-start.command
```

它会执行：

- 构建镜像
- 启动容器
- 映射端口 `3009`
- 挂载本地 `./data` 目录保存数据库

启动完成后访问：

```bash
http://localhost:3009
```

## 更新项目

如果你修改了源码，或者从 Git 拉了最新代码，执行：

```bash
./docker-update.command
```

它会：

- 停掉当前容器
- 按最新源码重新 build
- 重新启动服务

数据库数据会保留。

## 删除容器

如果你只想停掉并删除容器，但保留数据库数据，执行：

```bash
./docker-remove.command
```

这会保留：

- `./data/app.db`

下次重新启动后，原来的配置和反馈数据仍然在。

## 彻底删除

如果你想把容器和本地数据库一起清掉，执行：

```bash
./docker-remove-all.command
```

这会删除：

- Docker 容器
- 本地 SQLite 数据库文件

下次启动时会重新初始化种子数据。

## Docker 文件说明

项目中新增的 Docker 相关文件：

- `Dockerfile`
- `docker-compose.yml`
- `docker-start.command`
- `docker-update.command`
- `docker-remove.command`
- `docker-remove-all.command`
- `.dockerignore`

## 数据存储说明

当前项目使用本地 SQLite：

- 数据目录：`./data`
- 数据库文件：`./data/app.db`

在 Docker 启动时，这个目录会挂载到容器内部：

- 容器内路径：`/app/data`

所以只要不删除本地 `data` 目录，数据就会保留。

## 常用命令

查看运行中的容器：

```bash
docker ps
```

查看日志：

```bash
docker compose logs -f
```

重新强制构建并启动：

```bash
docker compose up -d --build
```

停止并删除容器：

```bash
docker compose down --remove-orphans
```

## 常见问题

### 1. 双击脚本没反应

先执行：

```bash
chmod +x ./*.command
```

如果还是被系统拦截，用 Finder 右键脚本，选择“打开”。

### 2. 3009 端口被占用

先检查是否已有程序占用：

```bash
lsof -i :3009
```

如果需要，可以修改 [docker-compose.yml](C:/Users/Niko.Mao/CodesR/Mendix-RAG/docker-compose.yml) 里的端口映射。

### 3. 页面打不开

先看容器是否启动成功：

```bash
docker ps
```

再看日志：

```bash
docker compose logs -f
```

### 4. 想保留数据但重建服务

执行：

```bash
./docker-update.command
```

这个操作不会删除 `./data/app.db`。

### 5. 想恢复到初始状态

执行：

```bash
./docker-remove-all.command
```

然后再执行：

```bash
./docker-start.command
```

## 当前说明

这个 Docker 方案适合你把源码直接带到演示机或 Mac 开发机上快速启动。

如果后面你准备做正式交付，我建议下一步再补：

- 多环境配置
- 外部数据库
- 反向代理
- HTTPS
- 自动备份
