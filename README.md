# 成长手册

送给安宝的翻页式成长记忆书 —— Three.js 真实 3D 六孔活页夹 + 可编辑内容。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址（默认 `http://localhost:5173`）。

生产构建：

```bash
npm run build
npm run preview
```

## 功能

- 封面着陆页，点击打开活页夹
- **Three.js 3D 翻页**：活页夹厚度、灯光阴影、页面卷曲几何
- 右侧年份标签跳转
- 桌面拖拽 / 点击半页翻页；手机可点「上一页 / 下一页」
- **管理后台**：编辑标题/日期/正文、上传图片、增删排序页面

## 管理编辑

1. 着陆页点「管理编辑」，或打开手册后点右上角铅笔图标
2. 输入密码：`anbao2026`（v1 本地密钥，可在 `src/data/handbookStore.ts` 修改）
3. 修改即时保存

### 持久化

- 使用浏览器 **`localStorage`**，键名：`chengzhang-shouce-v2`
- 刷新、关闭标签后仍保留（同一浏览器 / 同源）
- 换设备、清站点数据或无痕模式不会同步
- 「恢复默认」会清空本地修改并写回示例内容
- 自定义图片以 Data URL 存入 localStorage，单张建议 &lt; 2.5MB

## 技术

- Vite + React + TypeScript
- Three.js（WebGL 活页夹 / 卷曲翻页 / 灯光阴影）
- Canvas 2D 生成纸页贴图
- Google Fonts：Ma Shan Zheng / Caveat / Outfit / ZCOOL XiaoWei
