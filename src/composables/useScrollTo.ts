// 錨點滾動工具
// 用途：Navbar 點擊「商品特色」「一鍵速算」「常見問題」時，
//      平滑滾動到首頁對應的區塊，不用切換網址
// 只在首頁（單頁式設計）使用

export function useScrollTo() {
  // id：目標區塊的 HTML id（例如 'quote-section'）
  function scrollToSection(id: string) {
    const el = document.getElementById(id) // 找到對應的 DOM 元素
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' }) // 平滑滾動過去
    }
  }

  return { scrollToSection }
}