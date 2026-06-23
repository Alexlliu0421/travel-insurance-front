<script setup lang="ts">
import { ref, computed } from 'vue'

interface FaqItem {
    q: string
    a: string
}

const faqList: FaqItem[] = [
    // 帳號與註冊
    { q: '註冊時為什麼要驗證 Email？', a: '為了確保您填寫的聯絡資訊真實有效，註冊後需點擊驗證信中的連結啟用帳號，未驗證的帳號無法登入。' },
    { q: '沒有收到驗證信怎麼辦？', a: '請確認信箱地址填寫正確，並檢查垃圾信件匣。驗證連結有效期限為 24 小時，逾期請重新註冊。' },
    { q: '驗證連結過期了怎麼辦？', a: '驗證連結逾期 24 小時後會失效，請重新填寫註冊表單，系統會寄出新的驗證信。' },
    { q: '登入帳號是用 Email 還是身分證字號？', a: '登入帳號為身分證字號，密碼為您註冊時設定的密碼。' },
    { q: '忘記密碼怎麼辦？', a: '可在登入視窗點擊「忘記密碼」，輸入註冊時填寫的 Email，系統會寄送一封重設密碼信，點擊信中連結即可設定新密碼。' },
    { q: '可以修改註冊時填寫的資料嗎？', a: '登入後可至個人資料頁面修改姓名、電話、地址、國籍與職業類別等資訊。' },
    { q: '身分證字號填寫錯誤格式會怎樣？', a: '系統會即時檢查身分證字號格式是否正確（包含檢查碼驗證），格式錯誤無法送出註冊。' },

    // 投保資格
    { q: '什麼年齡可以投保？', a: '被保人年齡需在 85 歲以下，超過 85 歲網路投保不開放承保。' },
    { q: '投保天數有限制嗎？', a: '投保天數須介於 3 天至 180 天之間。' },
    { q: '出發日可以選擇今天以前的日期嗎？', a: '不可以，出發日不得早於投保當日。' },
    { q: '回程日一定要晚於出發日嗎？', a: '是的，系統會檢查回程日必須晚於出發日，否則無法試算或投保。' },
    { q: '職業類別會影響保費嗎？', a: '會，不同職業類別對應不同的職業費率，高風險職業的保費會相對較高。' },
    { q: '我不知道自己的職業屬於哪一類怎麼辦？', a: '請依照表單上的職業說明選擇最接近的類別，如有疑問可聯繫客服協助確認。' },

    // 保額與保費
    { q: '保額方案有哪些選擇？', a: '目前提供 100萬、300萬、500萬、1000萬元等保額方案，可依需求選擇。' },
    { q: '保費怎麼計算的？', a: '保費依保額、投保天數、被保人年齡性別（死亡率）、職業類別等因素綜合計算。' },
    { q: '保額越高保費就一定越貴嗎？', a: '通常是的，保額越高、投保天數越長，保費會相對提高。' },
    { q: '可以先試算保費再決定要不要投保嗎？', a: '可以，首頁的「一鍵速算」功能不需登入即可試算保費，確認金額後再決定是否投保。' },
    { q: '試算結果跟正式投保金額會不一樣嗎？', a: '試算結果即為正式保費試算邏輯，只要填寫資料一致，正式投保金額應與試算結果相同。' },

    // 投保流程
    { q: '投保需要登入會員嗎？', a: '保費試算不需登入，但正式送出投保申請需先登入會員。' },
    { q: '投保後多久會生效？', a: '保單送出後依系統流程進行審核，審核通過後保單即正式生效。' },
    { q: '投保後可以查詢保單狀態嗎？', a: '登入會員中心後，可在「我的保單」頁面查詢保單目前的處理狀態。' },
    { q: '投保資料填寫錯誤可以更改嗎？', a: '保單狀態為草稿（DRAFT）時可進行編輯，一旦送出審核後請聯繫客服協助處理。' },
    { q: '可以幫家人投保嗎？', a: '可以，投保時填寫的「被保人資料」可以是與要保人不同的人。' },

    // 取消與保單管理
    { q: '投保後可以取消保單嗎？', a: '可以，登入會員中心後在「我的保單」頁面可申請取消保單。' },
    { q: '取消保單會退費嗎？', a: '退費規則依保單狀態與相關規定處理，請於申請取消時留意系統提示。' },
    { q: '保單可以下載 PDF 嗎？', a: '可以，在「我的保單」頁面可下載保單 PDF 電子檔。' },

    // 簽核流程（業務/主管相關，提供一般概念性說明）
    { q: '保單送出後是誰審核？', a: '保單送出後會進入業務員與主管的審核流程，依保單狀態進行簽核。' },
    { q: '保單被駁回了怎麼辦？', a: '保單被駁回後會收到通知，請依駁回意見修改後重新送出。' },

    // 其他
    { q: '這個系統支援哪些國籍的旅客投保？', a: '系統提供多國籍選項供使用者選擇，國籍欄位僅作為資料登錄用途。' },
    { q: '系統的保障範圍包含哪些？', a: '本保單提供意外身故/失能保障與海外突發疾病醫療保障，依約定保額給付保險金。' },
]

const searchKeyword = ref('') // 搜尋關鍵字 v-model綁定
const expandedAll = ref(false)
const openStates = ref<boolean[]>(faqList.map(() => false))
function openLink(url: string) {
    window.open(url, '_blank')
}
const filteredFaq = computed(() =>
    faqList
        // 先把陣列裡每一題原本的 index（在 faqList 裡的位置）記錄下來，
        // 因為篩選後位置會變動，但畫面上每一題要展開/收起，要靠原始 index 對應 openStates 陣列
        .map((item, index) => ({ ...item, index }))
        // 再過濾：只留下「題目」或「答案」裡，包含使用者輸入的關鍵字的那幾題
        // .includes() 是字串方法，檢查 searchKeyword 有沒有出現在這段文字裡
        // 如果 searchKeyword 是空字串，每一題都會符合（等於沒有篩選，顯示全部）
        .filter((item) => item.q.includes(searchKeyword.value) || item.a.includes(searchKeyword.value))
)

function toggleAll() {
    // 把 expandedAll 的布林值反轉：true 變 false，false 變 true
    // 這個變數同時也是按鈕顯示文字的依據（true 顯示「收起全部」，false 顯示「展開全部」）
    expandedAll.value = !expandedAll.value

    // 把 openStates 這個陣列裡的每一個值，都改成 expandedAll 的最新狀態
    // .map(() => expandedAll.value) 不管原本每一題是展開還是收起，
    // 一律覆蓋成同一個值（全部變 true 或全部變 false）
    openStates.value = openStates.value.map(() => expandedAll.value)
}
</script>

<template>
    <div id="faq-section" class="q-px-xl q-py-xl">
        <div class="text-h4 text-weight-bold text-center q-mb-md">常見問題</div>
        <div class="text-subtitle1 text-grey-7 text-center q-mb-lg">
            您可能想了解的投保相關問題
        </div>

        <div class="row justify-center q-mb-md">
            <div class="col-12 col-md-6">
                <div class="row items-center q-gutter-sm">
                    <q-input v-model="searchKeyword" placeholder="請輸入關鍵字搜尋" outlined dense class="col">
                        <template #prepend>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                    <q-btn flat dense :label="expandedAll ? '收起全部' : '展開全部'" @click="toggleAll" />
                </div>
            </div>
        </div>

        <div class="row justify-center q-mb-md">
            <div class="col-12 col-md-6 row justify-center items-center q-gutter-sm">
                <q-chip clickable color="primary" text-color="white"
                    @click="openLink('https://www.boca.gov.tw/sp-trwa-list-1.html')">
                    外交部-旅遊警示分級表
                </q-chip>
                <q-chip clickable color="primary" text-color="white" @click="openLink('https://www.foi.org.tw/')">
                    金融消費評議中心
                </q-chip>
            </div>
        </div>

        <div class="row justify-center">
            <div class="col-12 col-md-6">
                <q-list bordered>
                    <!-- q-expansion-item：Quasar 框架內建的「可展開折疊面板」元件 -->
                    <!-- 展開/收起的功能本身是元件原生提供的：點擊標題會自動滑開/收起內容區塊，動畫跟互動邏輯都內建好了，我們完全沒有自己寫 -->
                    <!-- 我們唯一做的事，是透過 v-model 去讀取/操控它目前展開還是收起的狀態 -->

                    <!-- v-for：根據篩選後的結果（filteredFaq）逐一渲染，搜尋框打字時這裡會跟著變動 -->
                    <!-- :key：用原始 index（不是篩選後的順序），避免列表重新排序時元件被誤判重複渲染 -->
                    <!-- v-model：雙向綁定這一題的展開狀態，對應 openStates 陣列裡同一個 index 的值 -->
                    <!--          使用者點標題 → 元件自動把 openStates[item.index] 切換成 true/false -->
                    <!--          我們用程式碼改 openStates[item.index]（例如展開全部按鈕）→ 元件自動跟著展開/收起 -->
                    <q-expansion-item v-for="item in filteredFaq" :key="item.index" v-model="openStates[item.index]"
                        header-class="text-weight-medium">

                        <!-- #header：自訂這一題標題列的排版，取代預設純文字 label -->
                        <!--          目的是把「Q1.」編號跟題目文字分開上色顯示 -->
                        <template #header>
                            <q-item-section>
                                <span class="text-primary text-weight-bold">Q{{ item.index + 1 }}.</span>
                                <span class="q-ml-xs">{{ item.q }}</span>
                            </q-item-section>
                        </template>

                        <q-card>
                            <q-card-section class="text-grey-8">
                                {{ item.a }}
                            </q-card-section>
                        </q-card>
                    </q-expansion-item>

                    <div v-if="filteredFaq.length === 0" class="q-pa-md text-center text-grey-6">
                        找不到符合的問題
                    </div>
                </q-list>
            </div>
        </div>
    </div>
</template>