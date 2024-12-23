import { Editor, MarkdownView, Plugin } from "obsidian";

export default class FullWidthToHalfWidthPlugin extends Plugin {
    async onload() {
        this.addCommand({
            id: "convert-full-width-to-half-width",
            name: "Convert Full-width to Half-width",
            editorCallback: async (editor: Editor, view: MarkdownView) => {
                const text = editor.getValue();
                let convertedText = this.removeWindowNewLine(text)
                convertedText = this.convertFullWidthToHalfWidth(text);
                convertedText = this.convertJuliaType(convertedText);
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
    removeWindowNewLine(text: string): string {
        return text.replace(/\r\n/g, "\n");
    }
    convertFullWidthToHalfWidth(text: string): string {
        // 定义全角到半角的映射关系
        const fullWidthToHalfWidthMap: Record<string, string> = {
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
            "《": "<",
            "》": ">",
            "〈": "<",
            "〉": ">",
            "／": "/",
        };

        // 使用正则表达式批量替换
        let convertedText = text;
        const fullWidthChars = Object.keys(fullWidthToHalfWidthMap).join("");
        const regex = new RegExp(`[${fullWidthChars}]`, "g");
        convertedText = convertedText.replace(regex, (match) => {
            return fullWidthToHalfWidthMap[match] || match;
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
}
