var map = {};
const SHIFT_KEY_CODE = 16;
const CTRL_KEY_CODE = 17;
const ALT_KEY_CODE = 18;

var gca_hotkey = {

    inject: function () {

        onkeydown = function (e) {

            if (gca_hotkey.isSkip(e))
                return;

            e = e || event; // to deal with IE
            map[e.keyCode] = true;

            const isModifierKeyActive = gca_hotkey.isModifierKeyActive();
            const isNonModifierKeyActive = gca_hotkey.isNonModifierKeyActive();
            if (isModifierKeyActive && isNonModifierKeyActive) { // e.g. Alt + 1
                if (map[SHIFT_KEY_CODE]) {
                    gca_hotkey.executeShiftCombo(e);
                }
                else if (map[CTRL_KEY_CODE]) {

                }
                else if (map[ALT_KEY_CODE]) {
                    gca_hotkey.executeAltCombo(e);
                }

                gca_hotkey.unSetAllKeys();
            }
            else if (!isModifierKeyActive && isNonModifierKeyActive) { // e.g. Q
                gca_hotkey.executeNonCombo(e);
                map[e.keyCode] = false;
            }
        };

    },

    isSkip: function (e) {
        let skip = false;

        if (["INPUT", "SELECT", "TEXTAREA"].contains(document.activeElement.tagName))
            skip = true;

        return skip;
    },

    isModifierKeyActive: function () {
        return map[SHIFT_KEY_CODE] || map[CTRL_KEY_CODE] || map[ALT_KEY_CODE];
    },

    isNonModifierKeyActive: function () {
        for (var key in map) {
            if (map.hasOwnProperty(key) && !this.isModifierKey(parseInt(key)) && map[key]) {
                return true;
            }
        }

        return false;
    },

    isModifierKey: function (keyCode) {
        return [SHIFT_KEY_CODE, CTRL_KEY_CODE, ALT_KEY_CODE].contains(keyCode);
    },

    unSetAllKeys: function () {
        for (var key in map) {
            if (map.hasOwnProperty(key)) {
                map[key] = false;
            }
        }
    },


    //#region EXECUTES 
    executeShiftCombo: function (e) {
        if (map[9]) { // Tab
            if (gca_hotkey.utils.hasInventory()) {
                e.preventDefault();
                this.navigation.toPreviousInventoryTab();
            }
        }
    },

    executeAltCombo: function (e) {
        e.preventDefault();

        if (map[49]) { // 1
            // this.navigation.toExpedition();
            this.navigation.toExpedition();
        }
        else if (map[50]) { // 2
            this.navigation.toDungeon();
        }
        else if (map[51]) { // 3
            this.navigation.toCircusProvinciarum();
        }
        else if (map[52]) { // 4
            this.navigation.toHorreum();
        }
        else if (map[53]) { // 5
            this.navigation.toSmelter();
        }
        else if (map[54]) { // 6
            this.navigation.toWorkbench();
        }
        else if (map[83]) { // s
            this.navigation.toMessages();
        }
        else if (map[68]) { // d
            this.navigation.toPackages();
        }
        else if (map[67]) { // c
            // this.navigation.toDoll(1);
            this.navigation.toOverview();
        }
        else if (map[65]) { // a
            this.navigation.toProvinciarumArena();
        }
        else if (map[71]) { // g
            this.navigation.toGeneralMerchant();
        }
        else if (map[90]) { // z
            this.navigation.toAuctionAmulet();
        }
        else if (map[88]) { // x
            this.navigation.toPantheon();
        }
        else if (map[84]) { // t
            this.navigation.toTraining();
        }
    },

    executeNonCombo: function (e) {
        if (map[81]) { // q
            this.executePrimaryAction(e);
        }
        else if (map[69]) { // e
            this.executeSecondaryAction(e);
        }
        else if (map[9]) { // Tab
            if (gca_hotkey.utils.hasInventory()) {
                e.preventDefault();
                this.navigation.toNextInventoryTab();
            }
        }
    },

    executePrimaryAction: function (e) {
        let pageParams = gca_getPage.parameters();

        if (pageParams.mod == "location")
            this.expedition.attack();
        else if (pageParams.mod == "dungeon")
            this.dungeon.attack();
        else if (pageParams.mod == "arena" && pageParams.submod == "serverArena")
            this.arena.attack();
        else if (pageParams.mod == "forge" && pageParams.submod == "storage")
            this.forge.horreum.storeResources();
        else if (pageParams.mod == "forge" && pageParams.submod == "smeltery")
            this.forge.smelter.sendAllAsPackage();
        else if (pageParams.mod == "packages")
            this.packages.moveFirstPackageToInventory();
        else if (pageParams.mod == "auction")
            this.auction.toggleGoodPricedItems();
        else if (pageParams.mod == "quests")
            this.pantheon.quests.handleQuest();

    },

    executeSecondaryAction: function (e) {
        let pageParams = gca_getPage.parameters();

        if (pageParams.mod == "overview") {
            this.highlighter.highlightInventoryItems();
        }
        else if (pageParams.mod == "auction") {
            this.highlighter.highlightAuctionItems();
        }
        else if (pageParams.mod == "packages") {
            // this.packages.filterPackages();
            this.highlighter.highlightInventoryItems();
            this.highlighter.highlightPackageItems();
        }
        else if (pageParams.mod == "inventory") {
            this.highlighter.highlightShopItems();
            this.highlighter.highlightInventoryItems();
        }
        else if (pageParams.mod == "forge") {
            this.highlighter.highlightInventoryItems();
        }
        else if (pageParams.mod == "quests") {
            // this.pantheon.quests.newQuests();
        }
    },

    //#endregion

    navigation: {
        toExpedition: function () {
            window.location = jQuery("#cooldown_bar_expedition .cooldown_bar_link")[0].href;
        },

        toNextMercenary: function () {
            let currentIndex = gca_hotkey.utils.getActiveMercenaryIndex();
            let nextIndex = (currentIndex + 1) % 6;
            jQuery(".charmercsel")[nextIndex].click();
        },

        toPreviousMercenary: function () {
            let currentIndex = gca_hotkey.utils.getActiveMercenaryIndex();
            let previousIndex = (currentIndex + 5) % 6;
            jQuery(".charmercsel")[previousIndex].click();
        },

        toNextInventoryTab: function () {
            let currentIndex = gca_hotkey.utils.getCurrentInventoryTabIndex();
            let nextIndex = (currentIndex + 1) % 4;
            jQuery("#inventory_nav .awesome-tabs")[nextIndex].click();
        },

        toPreviousInventoryTab: function () {
            let currentIndex = gca_hotkey.utils.getCurrentInventoryTabIndex();
            let previousIndex = (currentIndex + 3) % 4;
            jQuery("#inventory_nav .awesome-tabs")[previousIndex].click();
        },

        toExpedition: function () {
            window.location = jQuery("#cooldown_bar_expedition .cooldown_bar_link")[0].href;
        },

        toDungeon: function () {
            window.location = jQuery("#cooldown_bar_dungeon .cooldown_bar_link")[0].href;
        },

        toCircusProvinciarum: function () {
            window.location = jQuery("#cooldown_bar_ct .cooldown_bar_link")[0].href;
        },

        toHorreum: function () {
            window.location = jQuery(".menuitem:contains(Horreum)")[0].href;
        },

        toSmelter: function () {
            window.location = jQuery(".menuitem:contains(Smelter)")[0].href;
        },

        toWorkbench: function () {
            window.location = jQuery(".menuitem:contains(Workbench)")[0].href;
        },

        toMessages: function () {
            window.location = jQuery("#menue_messages").attr("href");
        },

        toPackages: function () {
            window.location = jQuery("#menue_packages").attr("href");
        },

        toDoll: function (dollNo) {
            window.location = gca_getPage.link({ "mod": "overview", "doll": dollNo });
        },

        toOverview: function () {
            window.location = gca_getPage.link({ "mod": "overview" });
        },

        toProvinciarumArena: function () {
            window.location = gca_getPage.link({ "mod": "arena", "submod": "serverArena", "Type": "2" });
        },

        toGeneralMerchant: function () {
            window.location = gca_getPage.link({ "mod": "inventory", "sub": "3", "subsub": "2" });
        },

        toAuctionAmulet: function () {
            window.location = gca_getPage.link({ "mod": "auction", "qry": "", "itemLevel": "63", "itemType": "9", "itemQuality": "-1", "ttype": "3" });
        },

        toPantheon: function () {
            window.location = gca_getPage.link({ "mod": "quests" });
        },

        toTraining: function () {
            window.location = gca_getPage.link({ "mod": "training" });
        }

    },

    expedition: {
        targetMonsterNo: 4,

        attack: function () {
            if (this.isAttackAllowed())
                this.attackExpedition(this.targetMonsterNo);
            else
                gca_notifications.warning("Attack not allowed.");
        },

        isAttackAllowed: function () {
            let isAllowed = false;

            if (gca_hotkey.utils.isCountdownActive()) {
                const hourglassCount = this.getHourglassCount();
                if (hourglassCount > 0)
                    isAllowed = window.confirm("Use hourglass? Have: " + hourglassCount);
            }
            else
                isAllowed = true;

            return isAllowed;
        },

        getHourglassCount: function () {
            let count = 0;

            let hourglassTooltip = jQuery(".expedition_cooldown_reduce img").first().data().tooltip;
            if (hourglassTooltip)
                count = parseInt(hourglassTooltip[0][1][0].split(" ")[1].trim());

            return count;
        },

        attackExpedition: function (monsterNo) {
            if (monsterNo < 1 || monsterNo > 4) {
                gca_notifications.error("Invalid monster no");
                return;
            }

            jQuery("#expedition_list .expedition_box:nth-child(" + monsterNo + ") .expedition_button")[0].click();
        },

    },

    dungeon: {
        minionSelector: "#content img[src*='combatloc.gif']",
        bossSelector: "#content .map_label:contains('Boss')",

        attack: function () {
            if (gca_hotkey.utils.isCountdownActive()) {
                gca_notifications.warning("Wait for countdown");
                return;
            }

            if (gca_hotkey.utils.exists(this.bossSelector))
                this.attackBoss();
            else
                this.attackMinion();
        },

        attackMinion: function () {
            jQuery(this.minionSelector).last().click();
        },

        attackBoss: function () {
            jQuery(this.bossSelector).click();
        }
    },

    arena: {
        playerTargetSelector: "#own2 a.gca-player-target",

        attack: function () {
            let index = 0;

            if (gca_hotkey.utils.exists(this.playerTargetSelector))
                index = this.getFirstPlayerTargetIndex();
            else
                index = this.getHighestProvinceIndex();

            this.attackPlayer(index);
        },

        getFirstPlayerTargetIndex: function () {
            return jQuery("#own2 a").index(jQuery(this.playerTargetSelector).first());
        },

        getHighestProvinceIndex: function () {
            let playerRows = jQuery("#own2 tbody tr").slice(1);
            let maxProv = 0;
            let maxProvIndex = 0;

            for (let i = 0; i < playerRows.length; i++) {
                const row = playerRows[i];
                let currentProv = parseInt(jQuery(row).find("td:nth-child(3)").text().trim());
                if (currentProv > maxProv) {
                    maxProv = currentProv;
                    maxProvIndex = i;
                }
            }

            return maxProvIndex;
        },

        attackPlayer: function (playerIndex) {
            if (playerIndex < 0 || playerIndex > 4) {
                gca_notifications.error("Invalid player index");
                return;
            }

            if (gca_hotkey.utils.isCountdownActive()) {
                gca_notifications.warning("Wait for countdown");
                return;
            }

            jQuery("#content article table > tbody > tr:nth-child(" + (playerIndex + 2) + ") > td:nth-child(4) > div")[0].click();
        },

    },

    forge: {

        forge: {

        },

        smelter: {
            sendAllAsPackage: function () {
                let btn = jQuery("#content > table > tbody > tr > td:nth-child(1) > div.background_trader.pngfix > div.awesome-button")[0];
                if (btn === undefined) {
                    gca_notifications.warning("No package found");
                    return;
                }

                jQuery("#content > table > tbody > tr > td:nth-child(1) > div.background_trader.pngfix > div.awesome-button")[0].click()
            },
        },

        workbench: {

        },

        horreum: {
            storeResources: function () {
                jQuery("#store").click();
            },
        },



    },

    overview: {
        eatBestFood: function () {
            gca_tools.item.move(jQuery(".best-food")[0], 'avatar');
        }
    },

    packages: {

        moveFirstPackageToInventory: function () {
            gca_tools.item.move(jQuery("#packages .ui-draggable")[0], 'inv');
        },

        filterPackages: function () {
            window.location = gca_getPage.link({ "mod": "packages", "fq": "0", "qry": "", "page": "1" });
        }

    },

    auction: {

        toggleGoodPricedItems: function () {
            jQuery(".gca-auction-show-hide-button").first().click();
        },

    },

    pantheon: {
        quests: {
            acceptSelector: ".quest_slot_button.quest_slot_button_accept",
            finishSelector: ".quest_slot_button.quest_slot_button_finish",
            restartSelector: ".quest_slot_button.quest_slot_button_restart",
            importantQuestAcceptSelector: ".important-quest .quest_slot_button.quest_slot_button_accept",

            handleQuest: function () {
                if (gca_hotkey.utils.exists(this.finishSelector))
                    window.location = jQuery(this.finishSelector).first().attr("href");
                else if (gca_hotkey.utils.exists(this.restartSelector))
                    window.location = jQuery(this.restartSelector).first().attr("href");
                else if (gca_hotkey.utils.exists(this.importantQuestAcceptSelector))
                    window.location = jQuery(this.importantQuestAcceptSelector).first().attr("href");
            },

            newQuests: function () {
                jQuery("#quest_footer_reroll input[type='button']").first().click();
            },

        }
    },

    highlighter: {
        highlightInventoryItems: function () {
            this.highlightItems("inv");
        },

        highlightPackageItems: function () {
            this.highlightItems("packages");
        },

        highlightAuctionItems: function () {
            this.highlightItems("auction");
        },

        highlightShopItems: function () {
            this.highlightItems("shop");
        },

        highlightItems: function (type) {
            let model = gca_data.section.get("hotkey", "keywordHighlightModelWrapper");

            switch (type) {
                case "inv":
                    this.doHighlightItems("#inv", model.inv);
                    break;

                case "packages":
                    this.doHighlightItems("#packages", model.packages);
                    break;

                case "auction":
                    this.doHighlightItems("#auction_table", model.auction);
                    break;

                case "shop":
                    this.doHighlightItems("#shop", model.shop);
                    break;

                default:
                    break;
            }
        },

        doHighlightItems: function (containerSelector, keywordHighlightModel) {
            let that = this;

            jQuery(containerSelector + " .ui-draggable").each(function () {
                let item = this;

                jQuery(this).data().tooltip[0].forEach(prop => {

                    keywordHighlightModel.forEach(khm => {
                        if (prop[0].toString().toLowerCase().contains(khm.keyword.toString().toLowerCase())) {
                            that.highlightItem(item, khm.priority);
                        }
                    });
                });
            });
        },

        highlightItem: function (item, priority) {
            let borderCss = "";
            switch (priority) {
                case "H":
                    borderCss = "red solid 3px";
                    break;

                case "M":
                    borderCss = "orange solid 3px";
                    break;

                default:
                    borderCss = "green solid 3px";
                    break;
            }

            jQuery(item).css("border", borderCss);
        },

    },

    utils: {
        getActiveMercenaryIndex: function () {
            return jQuery(".charmercsel").index(jQuery(".charmercsel.active"));
        },

        getCurrentInventoryTabIndex: function () {
            return jQuery("#inventory_nav .awesome-tabs").index(jQuery("#inventory_nav .awesome-tabs.current").first());
        },

        isCountdownActive: function () {
            return this.exists("#content *[data-ticker-type='countdown'");
        },

        hasInventory: function () {
            return this.exists(".inventoryBox");
        },

        exists: function (selector) {
            return jQuery(selector).length > 0;
        }
    },

};


// Onload Handler
(function () {
    var loaded = false;
    var fireLoad = function () {
        if (loaded) return;
        loaded = true;
        gca_hotkey.inject();
    };
    if (document.readyState == 'interactive' || document.readyState == 'complete') {
        fireLoad();
    } else {
        window.addEventListener('DOMContentLoaded', fireLoad, true);
        window.addEventListener('load', fireLoad, true);
    }
})();


// ESlint defs
/* global gca_data, gca_getPage, gca_global, gca_links, gca_locale, gca_notifications, gca_options, gca_section, gca_tools */
/* global jQuery */

