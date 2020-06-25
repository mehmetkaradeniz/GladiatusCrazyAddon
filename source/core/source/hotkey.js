// Forge
var map = {};

var itemHighlightKeywords = new Array(
    // General
    // "Delicacy",
    // "Táliths",
    // "Damage +1",
    // "insanity",
    // "earth",
    // // "truth",
    // "Samnit",
    "Lucius",

     // Items have to do with "Tincture of Stamina"
     // source: https://en.gladiatus-tools.com/resources?id=38
    "Sentarions",
    "Tantus",
    "Fernabasts",
    "Korks",
    "Leandronimus",
    "Decimus",
    "Stoybaers",
    "Barbekuus",
    "Anchorons",
    "Appius",
    "Trafans",
    "Ichorus",
    "Opiehnzas",

    // Items have to do with "Potion of Perception"
    // source: https://en.gladiatus-tools.com/resources?id=42
    "Zimbris",
    "Thorstens",
    "Cheggovs",
    "Lucius",
    "Sphingens",
    "Appius",
    "Decimus",
    "Ichorus",
    "Opiehnzas",
    "Stoybaers",

   
);

var gca_hotkey = {

    inject: function () {

        onkeydown = onkeyup = function (e) {
            e = e || event; // to deal with IE
            map[e.keyCode] = e.type == 'keydown';
            let pageParams = gca_getPage.parameters();

            if (map[18]) { // Alt
                gca_hotkey.executeAltCombo(e);
            }
            else {
                if (map[16]) { // Shift
                    gca_hotkey.executeShiftCombo(e);
                }
                else if (map[9]) { // Tab
                    // if(pageParams.mod == "overview" || pageParams.mod == "player"){
                    //     e.preventDefault();
                    //     gca_hotkey.navigateToNextMercenary();
                    // }
                    if (gca_hotkey.hasInventory()) {
                        e.preventDefault();
                        gca_hotkey.navigateToNextInventoryTab();
                    }
                }
            }
        }
    },

    executeAltCombo: function (e) {
        if (map[49]) { // 1
            gca_hotkey.navigateToExpedition();
        }
        else if (map[50]) { // 2
            gca_hotkey.navigateToDungeon();
        }
        else if (map[51]) { // 3
            gca_hotkey.navigateToCircusProvinciarum();
        }
        else if (map[52]) { // 4
            gca_hotkey.navigateToHorreum();
        }
        else if (map[53]) { // 5
            gca_hotkey.navigateToSmelter();
        }
        else if (map[54]) { // 6
            gca_hotkey.navigateToWorkbench();
        }
        else if (map[83]) { // s
            e.preventDefault();
            gca_hotkey.navigateToMessages();
        }
        else if (map[69]) { // e
            e.preventDefault();
            gca_hotkey.navigateToPackages();
        }
        else if (map[67]) { // c
            e.preventDefault();
            gca_hotkey.navigateToDoll(1);
        }
        else if (map[65]) { // a
            e.preventDefault();
            gca_hotkey.navigateToProvinciarumArena();
        }
        else if (map[71]) { // g
            e.preventDefault();
            gca_hotkey.navigateToGeneralMerchant();
        }

        if (map[81]) { // Q
            let pageParams = gca_getPage.parameters();
            
            if (pageParams.mod == "location") {
                gca_hotkey.attackExpedition(2);
            }
            else if (pageParams.mod == "dungeon") {
                if (gca_hotkey.shouldEnterDungeon()) {
                    // gca_hotkey.enterDungeon();
                }
                else {
                    gca_hotkey.attackDungeon();
                }
            }
            else if (pageParams.mod == "arena" && pageParams.submod == "serverArena") {
                gca_hotkey.attackServerArenaPlayer(1);
            }
            else if (pageParams.mod == "forge" && pageParams.submod == "storage") {
                gca_hotkey.storeResources();
            }
            else if (pageParams.mod == "forge" && pageParams.submod == "smeltery") {
                gca_hotkey.sendAllAsPackage();
            }
            else if (pageParams.mod == "packages") {
                gca_hotkey.moveFirstPackageToInventory();
            }
            else if (pageParams.mod == "auction") {
                gca_hotkey.highlightAuctionItems();
                // gca_hotkey.hideBadPricedItems();
            }
            else if (pageParams.mod == "inventory") {
                gca_hotkey.highlightMerchantItems();
            }
        }
    },

    executeShiftCombo: function (e) {
        if (map[9]) { // Tab
            // if(pageParams.mod == "overview" || pageParams.mod == "player"){
            //     e.preventDefault();
            //     gca_hotkey.navigateToPreviousMercenary();
            // }
            if (gca_hotkey.hasInventory()) {
                e.preventDefault();
                gca_hotkey.navigateToPreviousInventoryTab();
            }
        }
    },

    navigateToNextMercenary: function () {
        let currentIndex = this.getActiveMercenaryIndex();
        let nextIndex = (currentIndex + 1) % 6;
        jQuery(".charmercsel")[nextIndex].click();
    },

    navigateToPreviousMercenary: function () {
        let currentIndex = this.getActiveMercenaryIndex();
        let previousIndex = (currentIndex + 5) % 6;
        jQuery(".charmercsel")[previousIndex].click();
    },

    getActiveMercenaryIndex: function () {
        return jQuery(".charmercsel").index(jQuery(".charmercsel.active"));
    },

    hasInventory: function () {
        return this.exists(".inventoryBox");
    },

    navigateToNextInventoryTab: function () {
        let currentIndex = this.getCurrentInventoryTabIndex();
        let nextIndex = (currentIndex + 1) % 4;
        jQuery("#inventory_nav .awesome-tabs")[nextIndex].click();
    },

    navigateToPreviousInventoryTab: function () {
        let currentIndex = this.getCurrentInventoryTabIndex();
        let previousIndex = (currentIndex + 3) % 4;
        jQuery("#inventory_nav .awesome-tabs")[previousIndex].click();
    },

    getCurrentInventoryTabIndex: function () {
        return jQuery("#inventory_nav .awesome-tabs").index(jQuery("#inventory_nav .awesome-tabs.current").first());
    },

    navigateToExpedition: function () {
        window.location = jQuery("#cooldown_bar_expedition .cooldown_bar_link")[0].href;
    },

    navigateToDungeon: function () {
        window.location = jQuery("#cooldown_bar_dungeon .cooldown_bar_link")[0].href;
    },

    navigateToCircusProvinciarum: function () {
        window.location = jQuery("#cooldown_bar_ct .cooldown_bar_link")[0].href;
    },

    navigateToHorreum: function () {
        window.location = jQuery(".menuitem:contains(Horreum)")[0].href;
    },

    navigateToSmelter: function () {
        window.location = jQuery(".menuitem:contains(Smelter)")[0].href;
    },

    navigateToWorkbench: function () {
        window.location = jQuery(".menuitem:contains(Workbench)")[0].href;
    },

    navigateToMessages: function () {
        window.location = jQuery("#menue_messages").attr("href");
    },

    navigateToPackages: function () {
        window.location = jQuery("#menue_packages").attr("href");
    },

    navigateToDoll: function (dollNo) {
        window.location = gca_getPage.link({ "mod": "overview", "doll": dollNo });
    },

    navigateToProvinciarumArena: function () {
        window.location = gca_getPage.link({ "mod": "arena", "submod": "serverArena", "Type": "2" });
    },

    navigateToGeneralMerchant: function () {
        window.location = gca_getPage.link({ "mod": "inventory", "sub": "3", "subsub": "2" });
    },

    attackExpedition: function (monsterNo) {
        if (monsterNo < 1 || monsterNo > 4) {
            gca_notifications.error("Invalid monster no");
            return;
        }

        if (this.isCountdownActive()) {
            gca_notifications.warning("Wait for countdown");
            return;
        }

        jQuery("#expedition_list .expedition_box:nth-child(" + monsterNo + ") .expedition_button")[0].click();
    },

    attackDungeon: function () {
        if (this.isCountdownActive()) {
            gca_notifications.warning("Wait for countdown");
            return;
        }

        if (this.dungeonBossExists()) {
            this.attackDungeonBoss();
        }
        else {
            this.attackDungeonMinion();
        }
    },
    shouldEnterDungeon: function () {
        return this.exists(".button1[value=Normal]");
    },

    enterDungeon: function () {
        jQuery(".button1[value=Normal]").click();
    },

    dungeonBossExists: function () {
        return this.exists("#content .map_label:contains('Boss')");
    },

    attackDungeonBoss: function () {
        jQuery("#content .map_label:contains('Boss')").click();
    },

    attackDungeonMinion: function () {
        jQuery("#content img[src*='combatloc.gif']").last().click()
    },

    attackServerArenaPlayer: function (playerNo) {
        if (playerNo < 1 || playerNo > 5) {
            gca_notifications.error("Invalid player no");
            return;
        }

        if (this.isCountdownActive()) {
            gca_notifications.warning("Wait for countdown");
            return;
        }

        jQuery("#content article table > tbody > tr:nth-child(" + (playerNo + 1) + ") > td:nth-child(4) > div")[0].click();
    },

    storeResources: function () {
        jQuery("#store").click();
    },

    sendAllAsPackage: function () {
        let btn = jQuery("#content > table > tbody > tr > td:nth-child(1) > div.background_trader.pngfix > div.awesome-button")[0];
        if (btn === undefined) {
            gca_notifications.warning("No package found");
            return;
        }

        jQuery("#content > table > tbody > tr > td:nth-child(1) > div.background_trader.pngfix > div.awesome-button")[0].click()
    },

    moveFirstPackageToInventory: function () {
        gca_tools.item.move(jQuery("#packages .ui-draggable")[0], 'inv');
    },

    isCountdownActive: function () {
        return this.exists("#content *[data-ticker-type='countdown'");
    },

    highlightAuctionItems: function () {
        this.highlightItems("#auction_table", itemHighlightKeywords);
    },

    highlightMerchantItems: function () {
        this.highlightItems("#shop", itemHighlightKeywords);
    },

    highlightItems: function (parentSelector, keywordDict) {
        let items = jQuery(parentSelector + " .ui-draggable");

        for (let i = 0; i < items.length; i++) {
            let itemProps = jQuery(items[i]).data().tooltip[0];
            for (let j = 0; j < itemProps.length; j++) {

                for (let k = 0; k < keywordDict.length; k++) {
                    let prop = itemProps[j][0].toString().toLowerCase();
                    let keyword = keywordDict[k].toLowerCase();
                    if (prop.contains(keyword)) {
                        jQuery(items[i]).css("border", "red solid 2px");
                        break;
                    }
                }
            }
        }
    },

    hideBadPricedItems: function () {
        jQuery(".auction_bid_div:not(:has(.gca-auction-good-price))").closest("td").hide()
    },

    exists: function (selector) {
        return jQuery(selector).length > 0;
    }
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

