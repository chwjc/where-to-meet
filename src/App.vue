<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 微信小程序按钮默认边框重置 */
button::after {
  border: none;
}
</style>
