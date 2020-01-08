import chartsRouter from '../router'
export function chartsRouters() {
  this.$router.addRoutes(chartsRouter);
  console.log(this.$router)
}
