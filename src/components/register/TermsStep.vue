<script setup lang="ts">
import { ref } from 'vue'

// 跟父層（RegisterPage.vue）雙向綁定：是否所有條款都已同意
const termsAgreed = defineModel<boolean>()

interface TermItem {
    title: string
    content: string
    agreed: boolean
}

// 條款內容（純展示用文字，自己編寫，不抄真實保險公司條款）
const terms = ref<TermItem[]>([
    {
        title: '個人資料保護法告知事項',
        content: `本公司依據個人資料保護法相關規定，向您告知以下事項：

一、蒐集之目的：
提供旅遊保險相關服務、辦理投保及理賠作業、客戶關係管理、會員服務及商品行銷推廣等用途。

二、個人資料類別：
包含但不限於姓名、身分證號、出生日期、聯絡電話、電子郵件、通訊地址、職業類別、性別等資料。

三、利用期間：
依相關法令所定之保存期限，或本公司執行業務所必須之保存期間，或服務終止後依法令規定之保存期限為止。

四、利用地區：
本公司營業所在地，以及依法得進行個人資料國際傳輸之地區。

五、利用對象：
本公司、本公司之關係企業、合作之保險公司、再保險公司，以及依法令規定得查詢之機關。

六、您的權利：
您得依個人資料保護法第三條規定，向本公司行使下列權利：
（一）查詢或請求閱覽個人資料。
（二）請求製給複製本。
（三）請求補充或更正個人資料。
（四）請求停止蒐集、處理或利用個人資料。
（五）請求刪除個人資料。

七、若您不提供真實且正確之個人資料，本公司將無法提供完整之投保及理賠服務。`,
        agreed: false,
    },
    {
        title: '服務使用條款',
        content: `使用本平台服務前，請詳閱以下條款，一旦完成註冊即視為您已閱讀並同意本條款之全部內容：

一、服務範圍：
本平台僅提供旅遊平安險之線上投保、保費試算、保單查詢及取消申請等相關服務，不包含其他險種之投保業務。

二、使用者義務：
使用者應確保所填寫之姓名、身分證號、聯絡方式、出生日期等資料皆為真實、正確、完整且為本人資料，如有不實，本公司得拒絕受理或撤銷已生效之保單。

三、帳號安全：
使用者應妥善保管自己的登入帳號及密碼，因使用者保管不當而導致之損失，本公司不負任何賠償責任。

四、審核權利：
本公司保留審核投保資格之權利，對於不符合承保條件（如年齡、職業類別限制）之申請，得不予承保。

五、服務變更：
本公司得視營運需要，於不損及使用者權益之前提下，修改、暫停或終止本服務之全部或一部分，並於修改前以適當方式公告。

六、智慧財產權：
本平台之網站內容、商標、文字、圖片等均受智慧財產權法令保護，使用者不得擅自重製、散布或為其他侵害行為。

七、其他未盡事項：
依本公司相關規定辦理，本公司保留修改本條款之權利，修改後將公告於本平台。`,
        agreed: false,
    },
])

// 偵測捲動到底部，自動勾選同意
// e：捲動事件物件；index：是第幾條條款（陣列索引）
function handleScroll(e: Event, index: number) {
    const el = e.target as HTMLElement
    // el.scrollTop：目前捲動的距離（從頂部算起）
    // el.clientHeight：可視區域的高度
    // el.scrollHeight：整段內容實際的總高度
    // 三者加起來判斷：「捲動距離 + 可視高度」是否已經接近「總高度」
    // -5 是給一點容錯空間，避免因為小數點誤差永遠判斷不到底部
    const reachedBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5

    if (reachedBottom) {
        // terms.value[index] 可能是 undefined（TypeScript 嚴格模式的提醒）
        // 先存到變數 term，確認真的存在才繼續操作，避免報錯
        const term = terms.value[index]
        if (term) {
            term.agreed = true // 自動打勾，代表「已詳閱完成」
            checkAllAgreed()    // 重新檢查是否「全部條款」都已同意
        }
    }
}

// 所有條款都勾選了，才能進入下一步
function checkAllAgreed() {
    termsAgreed.value = terms.value.every((t) => t.agreed)
}
</script>

<template>
    <div>
        <div class="text-subtitle1 q-mb-sm">
            閱讀條款
            <span class="text-caption text-orange q-ml-sm">請展開並滑動以詳閱條款</span>
        </div>

        <q-list bordered class="q-mb-md">
            <q-expansion-item v-for="(term, index) in terms" :key="index" default-opened>
                <template #header>
                    <q-checkbox :model-value="term.agreed" disable class="q-mr-sm" />
                    <q-item-section>{{ term.title }}</q-item-section>
                </template>

                <q-card>
                    <q-card-section style="max-height: 150px; overflow-y: auto"
                        @scroll="(e: Event) => handleScroll(e, index)">
                        <pre style="white-space: pre-wrap; font-family: inherit">{{ term.content }}</pre>
                    </q-card-section>
                </q-card>
            </q-expansion-item>
        </q-list>
    </div>
</template>