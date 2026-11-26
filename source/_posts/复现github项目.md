---
title: 复现 GitHub 项目
date: 2026-08-11 20:45:38
categories:
  - 工程实践
tags:
  - GitHub
  - 环境配置
  - 论文复现
  - ChangeFormer
---

# 复现github项目：

以changeformer为例：

**Anaconda Prompt**打开它。

**第 1 步：进入你想放代码的位置**

我的电脑anaconda装在c盘，放c盘user/23110下面，直接cd 文件夹进入。

```
D:
mkdir code
cd D:\code
```

**第 2 步：下载代码**，这一步很慢，可以直接在官网下载zip到刚刚创建的文件夹下面，然后直接cd 保存项目代码的文件夹名称

```
git clone https://github.com/wgcban/ChangeFormer.git
cd ChangeFormer（替换为你保存的文件夹名称）
```

**第 3 步：创建 conda 环境**

官方的 `requirements.txt` 是 Linux 环境导出的，在 Windows 上直接 `conda create --file requirements.txt` 可能失败。所以 Windows 推荐这样装：

```
conda create -n ChangeFormer python=3.8 -y
conda activate ChangeFormer
```

###### **先装依赖：**

（有的项目的txt是linux系统导出，若换windows要用别的命令

输入：

conda install -y numpy scipy matplotlib pillow tqdm

输入：
set HTTP_PROXY=http://127.0.0.1:51931
set HTTPS_PROXY=http://127.0.0.1:51931
然后用官方 PyPI 再装：
cmd
python -m pip install --proxy http://127.0.0.1:51931 numpy scipy matplotlib pillow tqdm einops==0.3.2 timm==0.4.12 opencv-python scikit-image
装完后测试：
cmd
python -c "import numpy, scipy, matplotlib, PIL, tqdm, einops, timm, cv2, skimage; print('basic packa

）

```
python -m pip install -r requirements.txt
```

如果这一步报错说找不到 requirements 或安装失败，再单独装基础依赖：

```
python -m pip install numpy scipy matplotlib pillow tqdm einops==0.3.2 timm==0.4.12
```

然后检查 `torch` 有没有装：

```
python -c "import numpy, torch; print('numpy ok'); print(torch.__version__); print('CUDA:', torch.cuda.is_available())"
```

如果这里提示 `No module named 'torch'`，再装 PyTorch。先用 CPU 版也能跑 demo，只是慢一点：

```
python -m pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

==如果你有 NVIDIA GPU，先试这个：==

```
conda install pytorch==1.10.1 torchvision==0.11.2 cudatoolkit=10.2 -c pytorch -y
```

再装其他依赖：

```
pip install einops==0.3.2 timm==0.4.12 tqdm scipy matplotlib pillow
```

检查 PyTorch：

```
python -c "import torch; print(torch.__version__); print(torch.cuda.is_available())"
```

如果输出 `True`，说明 GPU 可用；如果是 `False`，也可以先跑 CPU demo，只是慢一些。

**第 4 步：下载 LEVIR 预训练模型**

有代理先开代理再下载，先在代理软件里找本地端口号51931，再输入

set HTTP_PROXY=http://127.0.0.1:51931
	set HTTPS_PROXY=http://127.0.0.1:51931

在 `ChangeFormer` 目录里输入：

```
mkdir checkpoints
curl.exe -L -o levir_pretrained.zip https://github.com/wgcban/ChangeFormer/releases/download/v0.1.0/CD_ChangeFormerV6_LEVIR_b16_lr0.0001_adamw_train_test_200_linear_ce_multi_train_True_multi_infer_False_shuffle_AB_False_embed_dim_256.zip
```

解压：

```
tar -xf levir_pretrained.zip -C checkpoints
```

解压后你应该能看到类似这个目录：

```
checkpoints\CD_ChangeFormerV6_LEVIR_b16_lr0.0001_adamw_train_test_200_linear_ce_multi_train_True_multi_infer_False_shuffle_AB_False_embed_dim_256\best_ckpt.pt
```

可以检查一下：

```
dir checkpoints
```

**第 5 步：运行 LEVIR demo**

```
python demo_LEVIR.py --checkpoint_root checkpoints
```

跑完后看输出结果：

```
dir samples_LEVIR\predict_CD_ChangeFormerV6
```

如果里面出现预测图片，说明你已经成功复现了最小 demo。

**第 6 步：如果要训练完整 LEVIR-CD**

先下载处理好的数据集。README 给的 LEVIR-CD256 链接是 Dropbox：

```
curl.exe -L -o LEVIR-CD256.zip https://www.dropbox.com/s/18fb5jo0npu5evm/LEVIR-CD256.zip?dl=1
```

解压到比如：

```
mkdir D:\datasets
tar -xf LEVIR-CD256.zip -C D:\datasets
```

然后需要改代码里的数据路径。打开：

```
ChangeFormer\data_config.py
```

把这一行：

```
self.root_dir = '/media/lidan/ssd2/CDData/LEVIR-CD256/'
```

改成你的路径，例如：

```
self.root_dir = 'D:/datasets/LEVIR-CD256/'
```

然后再训练。Windows 上不要直接跑 `.sh`，可以把 README 里的参数改成一行命令，例如：

```
python main_cd.py --img_size 256 --loss ce --checkpoint_root checkpoints --vis_root vis --lr_policy linear --optimizer adamw --pretrain "" --split train --split_val test --net_G ChangeFormerV6 --multi_scale_train True --multi_scale_infer False --gpu_ids 0 --max_epochs 200 --project_name CD_ChangeFormerV6_LEVIR_mytrain --batch_size 4 --shuffle_AB False --data_name LEVIR --lr 0.0001 --embed_dim 256
```

注意：如果显存不够，把 `--batch_size 4` 改成 `2` 或 `1`。

