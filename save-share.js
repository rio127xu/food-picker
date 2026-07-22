// V3.7: save the generated result card locally instead of invoking WeChat.
// This intentionally overrides acceptAndShare from script.js after it loads.
acceptAndShare = async function (food, source) {
  recordAction(food, 'accept', source);

  try {
    const file = createShareImage(food, source);
    downloadShareImage(file);
    window.setTimeout(() => {
      alert('✅ 分享卡已生成并保存\n\n打开微信，把图片发给爸爸妈妈吧～\n\n如果手机没有自动保存，请在浏览器的“下载”中找到图片。');
    }, 250);
  } catch (error) {
    console.error('Failed to save share card:', error);
    alert('分享卡生成失败，请稍后再试。');
  }
};
