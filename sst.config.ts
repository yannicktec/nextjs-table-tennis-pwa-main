import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "aoe-tabletennis-app",
      region: "eu-central-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        customDomain: {
          domainName:
            stack.stage === "prod"
              ? "tt-crew.app"
              : `${stack.stage}.tt-crew.app`,
          hostedZone: "tt-crew.app",
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
