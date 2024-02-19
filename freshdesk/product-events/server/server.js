let cachedIparams = null;

exports = {
  onAppInstallHandler: function(args) {
    cachedIparams = args.iparams;
    console.log("Installation parameters cached");
  },

  onTicketCreateCallback: async function(args) {
    const iparams = cachedIparams || args.iparams;
  
    // Validate or log iparams
    console.log("Using iparams:", iparams);
  
    try {
      await $request.invokeTemplate('createIssue', {
        context: { iparam: iparams }, // Include iparams in the context if needed
        body: JSON.stringify({
          title: args.data.ticket.subject,
          body: args.data.ticket.description_text
        })
      });
  
      console.log("Issue created successfully in GitHub");
    } catch (error) {
      console.error("Error in creating GitHub issue:", error);
    }
  }
  };

