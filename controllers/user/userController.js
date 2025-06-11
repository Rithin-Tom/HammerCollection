

const loadHomepage = async (req,res) => {
    try {
         res.render("userHome");
    } catch (error) {
        console.log("problem to  load home page")
        res.satuts(500).send("server error")
        
    }
    
}

const loadLoginpage =async (req,res) => {
    try {
        res.render("login_page")
    } catch (error) {
        console.log("error in load loginpage",error.message)
        res.satuts(500).send("server error ")

        
    }
    
}
const loadSignUPpage =async (req,res) => {
    try {
        res.render("signUp")
    } catch (error) {
        console.log("error in load loginpage",error.message)
        res.satuts(500).send("server error ")

        
    }
    
}






module.exports={
    loadHomepage,
    loadLoginpage,
    loadSignUPpage
}