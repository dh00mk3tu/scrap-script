const { linkSync } = require('fs');
const puppeteer = require('puppeteer');
const xlsx = require('xlsx');
const endPoints = require("./list");
const baseUrl = "https://ticker.finology.in/company/";
const finalUrls = [];
const scrappedBrands = [];
const scrappedCompanyEssens = [];


async function getData(url, page, index){

    await page.goto(url);
    // await page.goto('https://ticker.finology.in/company/3IINFOTECH');

    // const brand = await page.$eval("#mainContent_brandsandproducts", brand => {
    //     return brand ? brand.innerText : "";
    // });

    const brand = await page.evaluate(() => {
        let el = document.querySelector("#mainContent_brandsandproducts:not(h4)")
        return el ? el.innerText : "Not Available";
    });

    const companyEssentials = await page.evaluate(() => {
        let el = document.querySelector("#mainContent_updAddRatios")
        return el ? el.innerText : "Not Available";
    });
    
    // const peerComparison = await page.evaluate(() => {
    //     let el = document.querySelector("thead")
    //     return el ? el.innerText : "Not Available";
    // });


    

    // const about = await page.evaluate(() => {
    //     let el = document.querySelector(".compbrief p");
    //     return el ? el.textContent : "Not Available";
    // });


    return {
        Company: index,
        // About: about,
        Brands : brand,
        CompanyEssentials: companyEssentials, 
        // PeerComparison: peerComparison
    }



    // console.log(brand);
    // console.log(companyEssentials);
    // console.log(peerComparison);
};  

async function prepareLinks() {
    for(let i = 0; i < endPoints.length; i++) {
        finalUrls.push(baseUrl + endPoints[i])
        continue;
    }
    return finalUrls; 
}

async function main() {
    const currUrl = await prepareLinks(); 

    
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    
    for(let i = 0; i < currUrl.length; i++) {
        console.log(currUrl[i]);
        const data = await getData(currUrl[i], page, endPoints[i]);
        
        scrappedBrands.push(data);
        // console.log(scrappedData);
    }

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(scrappedBrand);
    xlsx.utils.book_append_sheet(wb, ws, "Sheet-1");
    xlsx.writeFile(wb, "scrapped-data.xlsx");

}


main();

