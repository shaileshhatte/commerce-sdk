/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
"use strict";

import fs from "fs-extra";
import { expect, default as chai } from "chai";
import chaiAsPromised from "chai-as-promised";
import path from "path";
import * as renderer from "../src/renderer";
import * as parser from "../src/parser";
import tmp from "tmp";
import sinon from "sinon";
import _ from "lodash";
import * as lib from "webapi-parser";
/*
const fs = require("fs-extra");
const { expect, use } = require("chai");
const chaiAsPromised = require("chai-as-promised");
const path = require("path");
const renderer = require("/Users/unandyala/WebstormProjects/commerce-sdk/packages/generator/src/renderer.ts");
const tmp = require("tmp");
 */

before(() => {
  chai.use(chaiAsPromised);
});

describe("Testing", () => {
  it("Render Templates", () => {
    const renderDir = tmp.dirSync();
    const apiInputDir = tmp.dirSync();
    //build api config
    const apiConfig = {
      Customer: [{ name: "Customers" }, { name: "Shopper Customers" }],
      Product: [{ name: "Products" }, { name: "Shopper Products" }]
    };
    fs.writeJsonSync(path.join(apiInputDir.name, "api-config.json"), apiConfig);
    const fakeRenderApiFamily = sinon
      .stub(renderer, "renderApiFamily")
      .resolves();
    const fakeCreateIndex = sinon.stub(renderer, "createIndex");
    /*const fake = sinon.fake.resolves(null);
    sinon.replace(renderer, "renderApiFamily", fake);*/
    return renderer
      .renderTemplates(renderDir.name, apiInputDir.name, "api-config.json")
      .then(() => {
        const apiFamilies: string[] = _.keysIn(apiConfig);
        expect(fakeRenderApiFamily.callCount).to.equal(apiFamilies.length);
        expect(fakeCreateIndex.callCount).to.equal(1);
        expect(fs.existsSync(path.join(renderDir.name, "index.ts"))).to.be.true;
        expect(fakeCreateIndex.getCall(0).args[0]).to.deep.equal(apiFamilies);
      });
  });
});

/*
describe("Testing123", () => {
  const wap = lib.WebApiParser;
  const domain = lib.model.domain;
  before(() => {
    wap.init();
  });
  it("Render Templates", () => {
    const renderDir = tmp.dirSync();
    const apiInputDir = tmp.dirSync();
    //build api config
    const apiConfig = {
      Customer: [{ name: "Customers" }, { name: "Shopper Customers" }],
      Product: [{ name: "Products" }, { name: "Shopper Products" }]
    };
    fs.writeJsonSync(path.join(apiInputDir.name, "api-config.json"), apiConfig);
    const familyPromises = [];
    const apiFamilies: string[] = _.keysIn(apiConfig);
    apiFamilies.forEach(familyName => {
      const apiArr[] = apiConfig[familyName];
        apiArr.forEach(api => {
            const webApi = new domain.WebApi();
            webApi.withName(api.name);
            familyPromises.push(
                new Promise<any>((resolve, reject) => {
                    resolve(webApi);
                })
            );
        });

    });
    apiConfig.Customer.forEach(api => {
      const webApi = new domain.WebApi();
      webApi.withName(api.name);
      familyPromises.push(
        new Promise<any>((resolve, reject) => {
          resolve(webApi);
        })
      );
    });
    const fakeRenderApiFamily = sinon
      .stub(parser, "processApiFamily")
      .resolves(familyPromises);
    return renderer
      .renderTemplates(renderDir.name, apiInputDir.name, "api-config.json")
      .then(() => {
        /!* expect(fakeRenderApiFamily.callCount).to.equal(apiFamilies.length);
        expect(fakeCreateIndex.callCount).to.equal(1);*!/
        expect(fs.existsSync(path.join(renderDir.name, "index.ts"))).to.be.true;
        //expect(fakeCreateIndex.getCall(0).args[0]).to.deep.equal(apiFamilies);
      });
  });
});
*/
