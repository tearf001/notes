import FullWidthToHalfWidthPlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class TheSettingTab extends PluginSettingTab {
    plugin: FullWidthToHalfWidthPlugin;

    constructor(app: App, plugin: FullWidthToHalfWidthPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();
        containerEl.createEl("h1").insertAdjacentHTML("afterbegin", "全角字符转半角字符");
        containerEl.createEl("h1").insertAdjacentHTML("afterbegin", "设置");

        new Setting(containerEl).setName("removeMultipleLine").setDesc("Settings 设置替换 和 其他设置")
            .addToggle((toggle) =>
                // removeMultipleLine
                toggle
                    .setValue(this.plugin.settings.removeMultipleLine)
                    .onChange(async (value) => {
                        this.plugin.settings.removeMultipleLine = value;
                        await this.plugin.saveSettings();
                    })
            );
        // juliaTypeCheck
        new Setting(containerEl)
            .setName("juliaTypeCheck")
            .setDesc("Julia Type Check")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.juliaTypeCheck)
                    .onChange(async (value) => {
                        this.plugin.settings.juliaTypeCheck = value;
                        await this.plugin.saveSettings();
                    })
            );
        new Setting(containerEl)
            .setName("removeJuliaReplLeading")
            .setDesc("Remove Julia REPL Leading")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.removeJuliaReplLeading)
                    .onChange(async (value) => {
                        this.plugin.settings.removeJuliaReplLeading = value;
                        await this.plugin.saveSettings();
                    })
            );
        // replaces
        new Setting(containerEl)
            .setName("replaces")
            .setDesc("Replaces")
            .addTextArea((text) =>
                text
                    .setValue(JSON.stringify(this.plugin.settings.replaces, null, 2))
                    .onChange(async (value) => {
                        try {
                            this.plugin.settings.replaces = JSON.parse(value);
                            await this.plugin.saveSettings();
                        } catch (error) {
                            alert("JSON 格式错误");
                            console.error(error);
                        }
                    })
            );
        // replaceChars
        new Setting(containerEl)
            .setName("replaceChars")
            .setDesc("Replace Chars")
            .addTextArea((text) =>
                text
                    .setValue(JSON.stringify(this.plugin.settings.replaceChars, null, 2))
                    .onChange(async (value) => {
                        try {
                            this.plugin.settings.replaceChars = JSON.parse(value);
                            await this.plugin.saveSettings();
                        } catch (error) {
                            alert("JSON 格式错误");
                            console.error(error);
                        }
                    })
            );
    }
}