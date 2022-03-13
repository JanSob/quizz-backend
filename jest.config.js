// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    verbose: true,
    forceExit: true,
    testEnvironment: "node",
    setupFilesAfterEnv: ["jest-extended/all"],
    //clearMocks: true,
  };
  
  module.exports = config;
  
/*   // Or async function
  module.exports = async () => {
    return {
      verbose: true,
    };
  }; */