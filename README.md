# 成长手册

送给安宝的翻页式成长记忆书 —— 仿实体六孔活页夹的 skeuomorphic Web 体验。

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

## 功能（v1）

- 封面着陆页，点击打开活页夹
- 真实 3D 翻页（StPageFlip / react-pageflip）
- 右侧年份标签跳转（2026 / 2027 / 2028）
- 安宝成长日记示例内容
- 桌面与手机自适应缩放

## 技术

- Vite + React + TypeScript
- `react-pageflip` 翻页引擎
- Google Fonts：Ma Shan Zheng / Caveat / Outfit / ZCOOL XiaoWei
