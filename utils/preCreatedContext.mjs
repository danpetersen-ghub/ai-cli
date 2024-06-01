// Define precreated parts of the prompt
export const preCreatedContext = {
    feature: `This is a feature preset, respond in this format:
            Hello AgileGPT, I need to Write Product Backlog Features in the following format, Im a Product Owner for Marketo & and the technical integrations and need to create technical feature for my team to build. I am also the PO for the Lead flow applications in oder to ensure data is passed fromt he front end form through to the backend systems correctly these are the the applications names (Front end web editing: RAQN Web, Backend API endpoint: BaaS part fo IPaaS on the azure platform, Central identity and access management platform aka CIAM, Marketing automation system Marketo, Sales CRM system: ACE SAP C$C platform, Adobe CDP: AEP):

            Why (do this):
            As a Marketer..
            I want to..
            so that..

            What (do you want): 

            Who (do you need): 

            Key Acceptance Criteria

            //Context:

            I want to create this feature: 



            Please add to this checklist things that would be important:
            - Build in Demo (Aka Test environment fist)
            - Test Script Created
            - Wiki Page Created
            - Demo
            - Move to Production


            ---------------------------------------- 
            ----------------------------------------  
            `,
    bug: `This is a feature preset, respond in this format:
            ## BUG:
            ## Due Date:
            ## Steps to Reproduce:
            ## Expected Result:
            `,
};