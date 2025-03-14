import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    ko: {
        translation: {
            navigation: {
                board: "보드",
                timeline: "타임라인",
                calendar: "캘린더"
            },
            status: {
                new: "요청",
                in_progress: "진행",
                urgent: "지연",
                completed: "완료"
            },
            timeline: {
                previousMonth: "이전 달",
                nextMonth: "다음 달"
            }
        }
    },
    en: {
        translation: {
            navigation: {
                board: "Board",
                timeline: "Timeline",
                calendar: "Calendar"
            },
            status: {
                new: "Requested",
                in_progress: "In Progress",
                urgent: "Overdue",
                completed: "Completed"
            },
            timeline: {
                previousMonth: "Previous Month",
                nextMonth: "Next Month"
            }
        }
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    },
    debug: false
});

export default i18n;
