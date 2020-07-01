// Forge
var map = {};

var gca_hotkey = {

    inject: function () {

        onkeydown = onkeyup = function (e) {
            e = e || event; // to deal with IE
            map[e.keyCode] = e.type == 'keydown';
            let pageParams = gca_getPage.parameters();

            if (map[18]) { // Alt
                gca_hotkey.executeAltCombo(e);
            }
            else if (map[16]) { // Shift
                gca_hotkey.executeShiftCombo(e);
            }
            else { // Non combo stuff
                gca_hotkey.executeNonCombo(e);

            }
        }
    },



    // KEY HANDLING
    //--------------------------------------------------

    executeAltCombo: function (e) {
        e.preventDefault();
        if (map[81]) { // q
            this.executePrimaryAction(e);
        }
        else if (map[69]) { // e
            this.executeSecondaryAction(e);
        }
        else {
            this.executeOtherAction(e);
        }
    },

    executePrimaryAction: function (e) {
        let pageParams = gca_getPage.parameters();

        if (pageParams.mod == "overview") {
            // this.highlightInventoryItems();
        }
        else if (pageParams.mod == "location") {
            this.attackExpedition(4);
        }
        else if (pageParams.mod == "dungeon") {
            if (this.shouldEnterDungeon()) {
                // this.enterDungeon();
            }
            else {
                this.attackDungeon();
            }
        }
        else if (pageParams.mod == "arena" && pageParams.submod == "serverArena") {
            this.attackServerArenaPlayer(1);
        }
        else if (pageParams.mod == "forge" && pageParams.submod == "storage") {
            this.storeResources();
        }
        else if (pageParams.mod == "forge" && pageParams.submod == "smeltery") {
            this.sendAllAsPackage();
        }
        else if (pageParams.mod == "packages") {
            this.moveFirstPackageToInventory();
        }
        else if (pageParams.mod == "auction") {
            this.hideBadPricedItems();
        }
    },

    executeSecondaryAction: function (e) {
        let pageParams = gca_getPage.parameters();

        if (pageParams.mod == "overview") {
            this.highlightInventoryItems();
        }
        else if (pageParams.mod == "auction") {
            this.highlightAuctionItems();
        }
        else if (pageParams.mod == "packages") {
            // this.filterPackages();
            this.highlightInventoryItems();
            this.highlightPackageItems();
        }
        else if (pageParams.mod == "inventory") {
            this.highlightShopItems();
            this.highlightInventoryItems();
        }
        else if (pageParams.mod == "forge") {
            this.highlightInventoryItems();
        }
    },


    executeOtherAction: function (e) {
        let pageParams = gca_getPage.parameters();

        if (map[49]) { // 1
            this.navigateToExpedition();
        }
        else if (map[50]) { // 2
            this.navigateToDungeon();
        }
        else if (map[51]) { // 3
            this.navigateToCircusProvinciarum();
        }
        else if (map[52]) { // 4
            this.navigateToHorreum();
        }
        else if (map[53]) { // 5
            this.navigateToSmelter();
        }
        else if (map[54]) { // 6
            this.navigateToWorkbench();
        }
        else if (map[83]) { // s
            e.preventDefault();
            this.navigateToMessages();
        }
        else if (map[68]) { // d
            e.preventDefault();
            this.navigateToPackages();
        }
        else if (map[67]) { // c
            e.preventDefault();
            this.navigateToDoll(1);
        }
        else if (map[65]) { // a
            e.preventDefault();
            this.navigateToProvinciarumArena();
        }
        else if (map[71]) { // g
            e.preventDefault();
            this.navigateToGeneralMerchant();
        }
    },

    executeShiftCombo: function (e) {
        if (map[9]) { // Tab
            if (this.hasInventory()) {
                e.preventDefault();
                this.navigateToPreviousInventoryTab();
            }
        }
    },

    executeNonCombo: function (e) {
        if (map[9]) { // Tab
            if (this.hasInventory()) {
                e.preventDefault();
                this.navigateToNextInventoryTab();
            }
        }
    },



    // ACTIONS
    //--------------------------------------------------
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

    hideBadPricedItems: function () {
        jQuery(".auction_bid_div:not(:has(.gca-auction-good-price))").closest("td").hide()
    },

    filterPackages: function () {
        window.location = gca_getPage.link({ "mod": "packages", "fq": "0", "qry": "", "page": "1" });
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

