/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { discussion } from "./uitils/discussion";
import { CoWebsite } from "@workadventure/iframe-api-typings";

console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags);

    // Disable tutotial
    WA.player.state.tutorialDone = true;

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

    // Init discussion about contest
    initInfoDiscutionCOntest();

}).catch(e => console.error(e));

let isInfoDiscussionOpen = false;
const initInfoDiscutionCOntest = () => {
    WA.mapEditor.area.onEnter('contest').subscribe(() => {
        if(isInfoDiscussionOpen) return;
        isInfoDiscussionOpen = true;
        discussion.openDiscussionWebsite('info');
    });
    WA.mapEditor.area.onLeave('contest').subscribe(() => {
        isInfoDiscussionOpen = false;
        discussion.closeDiscussionWebsite('info');
    });
    WA.event.on('close-info').subscribe(() => {
        console.log('Close info');
        isInfoDiscussionOpen = false;
        discussion.closeDiscussionWebsite('info');
        openRandomApp();
    });
}

let cowebsite: CoWebsite|undefined;
const openRandomApp = async () => {
    if(cowebsite) {
        try{
            await cowebsite.close();
        }catch(e){
            console.warn('The cowebsite is already closed');
        }
    }
    cowebsite = await WA.nav.openCoWebSite(
        'https://wheelofnames.com/v7a-har',
        true, 
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    );
}

export {};
