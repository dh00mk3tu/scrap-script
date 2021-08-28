const { linkSync } = require('fs');
const puppeteer = require('puppeteer');
const xlsx = require('xlsx');
const endPoints = require("./list");
const baseUrl = "https://ticker.finology.in/company/";
const finalUrls = [];
const scrappedData = [];


async function getData(url, page){

    await page.goto(url);
    // await page.goto('https://ticker.finology.in/company/3IINFOTECH');

    // const brand = await page.$eval("#mainContent_brandsandproducts", brand => {
    //     return brand ? brand.innerText : "";
    // });

    const brand = await page.evaluate(() => {
        let el = document.querySelector("#mainContent_brandsandproducts")
        return el ? el.innerText : "";
    });

    const companyEssentials = await page.$eval("#companyessentials", companyEssentials => companyEssentials.textContent);
    const peerComparison = await page.$eval("#Listoutputinner", peerComparison => peerComparison.innerText);

    return {
        Brands : brand,
        CompanyEssentials: companyEssentials, 
        PeerComparison: peerComparison
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
        console.log(finalUrls[i]);
        const data = await getData(currUrl[i], page);
        scrappedData.push(data);
        console.log(scrappedData);
    }
    //     console.log(link[1]);
    //     const data = await getData(link, page);
    //     // console.log(data);
    //     scrappedData.push(data);
    // }
    // console.log(scrappedData);
}


main();

