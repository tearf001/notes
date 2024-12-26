import { Editor, MarkdownView, Plugin } from "obsidian";
import { TheSettingTab } from "./settings";

interface FullWidthToHalfWidthPluginSettings {
    replaces:Record<string, string>;
    replaceChars: Record<string, string>;
    juliaTypeCheck: boolean;
    removeMultipleLine: boolean;
    removeJuliaReplLeading: boolean;
}

const DEFAULT_SETTINGS: FullWidthToHalfWidthPluginSettings = {
    removeMultipleLine: true,
    removeJuliaReplLeading: true,
    replaces: {},
    // 定义全角到半角的映射关系
    replaceChars: {
        "，": ",",
        "。": ".",
        "！": "!",
        "？": "?",
        "：": ":",
        "；": ";",
        "（": "(",
        "）": ")",
        "【": "[",
        "】": "]",
        "「": "[",
        "」": "]",
        "、": ",",
        "　": " ", // 全角空格
        "～": "~",
        "—": "-",
        "“": '"',
        "”": '"',
        "‘": "'",
        "’": "'",
        "…": "...",
        "〈": "<",
        "〉": ">",
        "／": "/",
    },
    juliaTypeCheck: true,
};
export default class FullWidthToHalfWidthPlugin extends Plugin {
    settings: FullWidthToHalfWidthPluginSettings;

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new TheSettingTab(this.app, this));
        this.addCommand({
            id: "convert-full-width-to-half-width",
            name: "Convert Full-width to Half-width",
            editorCallback: async (editor: Editor, view: MarkdownView) => {
                const text = editor.getValue();
                let convertedText = text
                convertedText = this.convertFullWidthToHalfWidth(text);
                // not empty
                if(Object.keys(this.settings.replaces).length > 0){
                    for(const key in this.settings.replaces){
                        const regex = new RegExp(key, "g");
                        convertedText = convertedText.replace(regex, this.settings.replaces[key]);
                    }
                }
                if(this.settings.removeMultipleLine){
                    convertedText = this.removeMultipleLines(convertedText);
                }
                if(this.settings.juliaTypeCheck){
                    convertedText = this.convertJuliaType(convertedText);
                }
                if(this.settings.removeJuliaReplLeading){
                    convertedText = this.removeJuliaReplLeading(convertedText);
                } 
                if (text != convertedText) { // 添加此行，确保只有在内容真正发生更改时才替换
                    const cursor = editor.getCursor();
                    editor.replaceRange(convertedText, { line: 0, ch: 0 }, {
                        line: editor.lastLine(),
                        ch: editor.getLine(editor.lastLine()).length,
                    });
                    editor.setCursor(cursor);
                }
            },
        });
    }
    removeMultipleLines(text: string): string {
        return text.replace(/\r\n/g, "\n").replace(/\n{2,}/g, "\n");
    }
    convertFullWidthToHalfWidth(text: string): string {

        // 使用正则表达式批量替换
        let convertedText = text;
        const fullWidthChars = Object.keys(this.settings.replaceChars).join("");
        const regex = new RegExp(`[${fullWidthChars}]`, "g");
        convertedText = convertedText.replace(regex, (match) => {
            return this.settings.replaceChars[match] || match;
        });

        return convertedText;
    }
    convertJuliaType(text: string): string {
        const regex = /::(?<name>\w+)(?<start>[\(\[\{])(?<type>\w+)(?<end>[\)\}\]])/g;
        const regex2 = /where\s*(?<start>[\(\[\{])\s*(?<name>\w+)(?<bel><:)\s*(?<type>\w+)(?<end>[\)\}\]])/gi
        return text.replace(regex, (match, ...args) => {
            const { name, start, type, end } = args.pop();
            const fixedstart = start !== "{" ? "{" : start;
            const fixedend = end !== "}" ? "}" : end;
            return `::${name}${fixedstart}${type}${fixedend}`;
        }).replace(regex2, (match, ...args) => {
            const { name, bel, type } = args.pop();
            return `where {${name} ${bel} ${type}}`;
        })
    }
    removeJuliaReplLeading(text: string): string {
        const regex = /julia>\s+/g;
        return text.replace(regex, "");
    }
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
      }
    
    async saveSettings() {
        await this.saveData(this.settings);
    }
}
