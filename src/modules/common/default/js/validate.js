export function checkAlphaUnderscore(value, min, max, text,t) {
    const RE = /^[a-zA-Z0-9\_]+$/;
    if (value === "" || value === null) {
        return `Please enter ${text}`;
    }

    if(!RE.test(value))
      {
        return t('modules.Generic.errorMsg.checkAlphaUnderscorealphanumeral', {text: text})
    }
    if (value.length < min || value.length > max) {
      //return `Please enter a value of length minimum of ${min} and maximum of ${max} for ${text}`;
        return t('modules.Generic.errorMsg.checkAlphaUnderscorelength', {min:min , max:max, text:text})
    }

    return null;
}




export function checkClientPassword(value,min,max,text)
{
    var RE  = /^[a-zA-Z0-9\_\!\@\#\$]+$/;       
    if(value == "" || value==null)
    {
        return `Please enter ${text}`;
    }
    if(!RE.test(value))
    {
         return `Please enter only alphanumeral(underscore, @, # and ! also allowed) value for ${text}`;
    }
    if(value.length < min || value.length > max)
    {
         return `Please enter a value of length minimum of ${min} and maximum of ${max} for ${text}`;
    }
   
    return null;
}

export function checkipAddress(ipAddress,text,min,max,index)
{
    var isInvalid=false;
    var RE1 = /^[0-9]+$/i;

    if(ipAddress == "")
    {
      return "Please enter "+text;
    }
    if(!RE1.test(ipAddress))
    {
      return text+" should be numeric value";
    }

    if(index == 0)
   {
         if(ipAddress.charAt(0)=="0")
         {
            isInvalid=true;
           return  text+" Should not start with zero";
         }
   }
   if(isInvalid)
   {
      return  text+" Should not start with zero";
   }
   else
   {
   if(ipAddress.length>1 && index  <1 && parseInt(ipAddress)==0)
   {
       return text+" Should not contain all zeros";
   }

   else
   {
       if(parseInt(ipAddress)<min || parseInt(ipAddress)>max)
       {

        return text+" Should be between "+min+" and  "+max;
       }

       if(ipAddress.length>1 && index  <1)
       {

        if(ipAddress.charAt(0)=="0")
         {
          return text+" Should not start with zero";

        }
       }

    }
   }
    return null;
}

/*<!--***************************************************************************************
  FileName     : validate.js
  Author       :
  Project      : 
  Path         : 
  Comments     :
  Used Files   :

--------------------------------------------------------------------------------------
  Revn. No.| Modified By |   Date   |   Modification details, Purpose of modification
--------------------------------------------------------------------------------------
           |             |          |
--------------------------------------------------------------------------------------
**************************************************************************************/
/**********************************************************************************************************************
Function Name : alphaValidation 
Input parameters : objVal,min,max,text
   objVal-is the parameter to be validated
   min-to check the minimum length of objVal
   max-to check maximum length of objVal
   text-display name of objVal
   t - translatable return statement
Output parameters : true/false
Description : allows only alphabtes for objVal with certain min and max length
************************************************************************************************************************/
export function alphaValidation(objVal,min,max,text,t)
{
   var RE=/^[a-zA-Z]*$/;
   if(objVal == null || objVal =="")
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text})
   }
   if(!RE.test(objVal))
   {
      return t('modules.Generic.errorMsg.enterOnlyAlpha', {text: text})
   }
   if(objVal.length < min || objVal.length > max)
   {
      return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
   }
   return null;
}

/************************************************************************************************************
Function Name : alphaNumericWithSpecial
Input parameters : objVal,min,max,text
   objVal-is the parameter to be validated
   min-to check the minimum length of objVal
   max-to check maximum length of objVal
   text-display name of objVal
   t - translatable return statement
Output parameters : true/false
Description : allows alphanumeric and (space,_,-) starting with alphabet
****************************************************************************************************************/
export function alphaNumericWithSpecial(objVal,min,max,text,t)
{
   //var RE=/^[a-zA-Z]+[\s\-\_\.\)\(\&a-zA-Z0-9]*$/;
   var RE=/^[\s\-\_\.\)\(\&a-zA-Z0-9]*$/;
   if(objVal == null || objVal =="")
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text})
   }
   if(!RE.test(objVal))
   {
      return t('modules.Generic.errorMsg.alphaNumWithSplCharAndSpace', {text: text})
   }
   if(objVal.length < min || objVal.length > max)
   {
      return  t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
   }
   return null;
}




/************************************************************************************************************
Function Name : alphaNumericWithSpecialCharacters
Input parameters : objVal,min,max,text
   objVal-is the parameter to be validated
   min-to check the minimum length of objVal
   max-to check maximum length of objVal
   text-display name of objVal
   t - translatable return statement
Output parameters : true/false
Description : allows alphanumeric and (space,_,-)
****************************************************************************************************************/
export function alphaNumericWithSpecialCharacters(objVal,min,max,text,t)
{
   var RE = /^[a-zA-Z0-9\_\-\s]+$/;
   if(objVal == null || objVal =="")
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text})
   }
   if(!RE.test(objVal))
   {
      return t('modules.Generic.errorMsg.alphaNumWithUnderScoreSpacehyphen', {text: text})
   }
   if(objVal.length < min || objVal.length > max)
   {
      return  t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
   }
   return null;
}


/****************************************************************************************************
Function Name : alphaNumericValidation
Input parameters : objVal,min,max,text
   objVal-is the parameter to be validated
   min-to check the minimum length of objVal
   max-to check maximum length of objVal
   text-display name of objVal
   t - translatable return statement
Output parameters : true/false
Description : allows only alphnumeric values
*******************************************************************************************************/
export function alphaNumericValidation(objVal,min,max,text,t)
{
   var RE=/^[a-zA-Z0-9]*$/;
   if(objVal == null || objVal =="")
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text})
   }
   if(!RE.test(objVal))
   {
      return t('modules.Generic.errorMsg.alphaNum', {text: text})
   }
   if(objVal.length < min || objVal.length > max)
   {
      return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
   }
    const err = checkAllZeroes(objVal,t)
   {
      if(err)
            return err; 
   }
   return null;
}


/*---------- NUMERIC AND DECIMAL VALIDATIONS ---------- */

/*******************************************************************************************************
Function Name : numericValidation
Input parameters : objVal,min,max,text
   objVal-is the parameter to be validated
   min-to check the minimum length of objVal
   max-to check maximum length of objVal
   text-display name of objVal
Output parameters : true/false
Description : allows only natural numbers
******************************************************************************************************/
export function numericValidationVal(objVal,min,max,text,textMinVal,textMaxVal,t)
{
   var RE=/^[0-9]*$/;
   if(objVal == null || objVal =="")
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text})
    
   }
   if(!RE.test(objVal))
   {
      return t('modules.Generic.errorMsg.numeric', {text: text});
   }
   const err = checkInitialZero(objVal,text,t)
      if(err){
         return err
   }
   if(objVal.length < min || objVal.length > max)
   {
      return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text});
   }
   if(objVal < textMinVal ||  objVal > textMaxVal)
   {     
      return  t('modules.Generic.errorMsg.greaterOrLessThan', {textMinVal:textMinVal , textMaxVal:textMaxVal, text:text});
   }
   return null;
}

//***************************************************************************************************************************** */
export function numericValueValidationVal(objVal,min,max,text,t)
{
   var RE=/^[0-9]*$/;
   if(objVal == null || objVal =="")
   {
        return t('modules.Generic.errorMsg.mandatory', {text: text})
   }
   if(!RE.test(objVal))
   {
      return t('modules.Generic.errorMsg.numeric', {text: text})
   }
   if(parseInt(min) != 0){
      const err = checkInitialZero(objVal,text,t)
      if(err){
        return err
      }
   }

   if((parseInt(objVal) < parseInt(min)) || (parseInt(objVal) > parseInt(max)))
   {
      return t('modules.Generic.errorMsg.greaterOrLessThan', {textMinVal:min , textMaxVal:max, text:text});
   }
   return null;
}
//***************************************************************************************************************************** */
export function numericValidation(objVal,min,max,text,t)
{
   var RE=/^[0-9]*$/;
   if(objVal == null || objVal =="")
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text});
   }
   if(!RE.test(objVal))
   {
      return t('modules.Generic.errorMsg.numeric', {text: text});
   }
   const err = checkInitialZero(objVal,text,t)
   if(err){
        return err
   }

   if(objVal.length < min || objVal.length > max)
   {
      return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text});
   }
   return null;
}

/***********************************************************************************************************************************
Function Name : decimalValidation
Input parameters : objVal,min,max,text
   objVal-is the parameter to be validated
   min-to check the minimum length of objVal
   max-to check maximum length of objVal
   text-display name of objVal
Output parameters : true/false
Description : allows only integer or decimals
**************************************************************************************************************************************/
export function decimalValidation(objVal,min,max,text,t)
{
   var RE= /^[0-9]{1,20}[.]?[0-9]{0,20}$/;
   if(objVal == null || objVal =="")
   {
      return  t('modules.Generic.errorMsg.mandatory', {text: text});
   }
   if(!RE.test(objVal))
   {
      return t('modules.Generic.errorMsg.intOrDecimal', {text: text});
   }
   if(objVal.length < min || objVal.length > max)
   {
      return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text});
   }
   return null;
}
/********************************************************************************************************************************** */
export function hexadecimalValidation(objVal,min,max,text,t)
{
var RE =/^[0-9a-fA-F]+$/; 
 if(objVal == null || objVal =="")
 {
    return  t('modules.Generic.errorMsg.mandatory', {text: text});
 }
 if(!RE.test(objVal))
 {  
    return t('modules.Generic.errorMsg.hexaDec', {text: text});
 }
 if(objVal.length < min || objVal.length > max)
 {
    return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text});
 }
 return null;

}
/********************************************************************************************************************************* */
export function emailIdValidation(objVal,min,max,text,t)
{

      var RE=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 if(objVal == null || objVal =="")
 {
    return t('modules.Generic.errorMsg.mandatory', {text: text});
 }
 if(!RE.test(objVal))
 {
    return t('modules.Generic.errorMsg.validEmail', {text: text});;
 }
 if(objVal.length < min || objVal.length > max)
 {
    return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text});
 }
 return null;
}
/*************************************************************************************************************************************
Function Name : validateDecimalPrecision
Input parameters : objVal,maxDec,maxFloat,text
   objVal-is the parameter to be validated
   maxDec-to check the maximum length of objVal before point
   maxFloat-to check maximum length of objVal after point
   text-display name of objVal
Output parameters : true/false
Description : allows only integer or decimals with certain maximum length for before and after precision
*************************************************************************************************************************************/
export function validateDecimalPrecision(objVal,maxDec,maxFloat,text,t)
{
    var dotval=objVal.indexOf(".");
    if(dotval==-1)   //for natural numbers
        var RE=/^[0-9]{1,20}$/
    else
        var RE= /^[0-9]{1,20}[.]?[0-9]{0,20}$/;
    if (objVal == "")   //for decimal numbers
    {
        return t('modules.Generic.errorMsg.mandatory', {text: text});
    }
    if(!RE.test(objVal))
    {      
       return t('modules.Generic.errorMsg.validText', {text: text});
    }
    if(dotval>=0 && (objVal.length-dotval)==1)
    {
        return t('modules.Generic.errorMsg.atlstOneDigitAfterDec', {text: text});
    }
    if(dotval>=0 && dotval>maxDec)
    {
        return t('modules.Generic.errorMsg.maxDec', {maxDec: maxDec});
    }
    if(dotval==-1 && objVal.length>maxDec)
    {
        return t('modules.Generic.errorMsg.maxDec', {maxDec: maxDec});
    }
    if(dotval>=0)
    {
        if(((objVal.length-dotval)-1)>maxFloat)
        {
          return t('modules.Generic.errorMsg.maxFloat', {maxFloat : maxFloat});
        }
    }
    return null;
}


/*---------- MSISDN VALIDATIONS ---------- */

/***********************************************************************************************************************
Function Name : msisdnValidation
Input parameters : msisdnNum,cc,inter_allow,msisdn_length
   objVal- is the parameter to be validated
   cc- country code parameter is passed as per requirement
   inter_allow- flag if true then should contain '+' as suffix and viceversa
   msisdn_length- tells the exact length of msisdnNum
Output parameters : true/false
Description : the msisdn number must be in the form [+]cc+number=objVal
*************************************************************************************************************************/
export function msisdnValidation(msisdnNum,cc,inter_allow,msisdn_length,t)
   {
    var RE=/^[0-9]*$/;
    var RE1=/^[+]+[0-9]*$/;
    if(objVal == "" || objVal == null)
    {
      return t('modules.Generic.errorMsg.enterMsisdn')
    }
        if(inter_allow ==1)
         {
            if(objVal.length == msisdn_length+1)
            {
               if (RE1.test(objVal))
               {
                  if(objVal.indexOf(cc)!=1)
                  {
                     return t('modules.Generic.errorMsg.invalidCc');
                  }
                  else
                  {
                     var number=objVal.substring(cc.length+1,msisdn_length);
                     var returnVal=checkAllZeroes(number);
                     if(returnVal)
                        return returnVal;
                     else
                     {               
                        return nulll;
                     }
                  }
               }
               else
               {
                  return t('modules.Generic.errorMsg.msisdnRule',{cc:cc, msisdnLen:msisdn_length+1});
               }
            }
            else
            {
                  return t('modules.Generic.errorMsg.msisdnLen',{msisdnLen:msisdn_length+1});
            }
         }
         else if(inter_allow==0)
         {
            if(objVal.length == msisdn_length)
            {
               if (RE.test(objVal))
               {
                  if(objVal.indexOf(cc)!=0)
                  {
                     return t('modules.Generic.errorMsg.invalidCc');;
                  }
                  else
                  {
                     var number=objVal.substring(cc.length,msisdn_length);
                     var returnVal=checkAllZeroes(number);
                     if(returnVal)
                        return returnVal;
                     else
                     {
                        return null;
                     }

                  }
               }
               else
               {
                    return t('modules.Generic.errorMsg.msisdnRule',{cc:cc, msisdnLen:msisdn_length+1});
               }
            }
            else
            {
                return t('modules.Generic.errorMsg.msisdnLen',{msisdnLen:msisdn_length+1});;
            }
         }
   }


/*******************************************************************************************************************************
Function Name : msisdnCheck
Input parameters : num,inter_allow,cc,length,text
   num- is the parameter to be validated
   inter_allow- flag if true then num should in international format
   cc- country code parameter is passed as per requirement
   length- tells the exact length of num excluding cc
   text- display name for num
Output parameters : true/false
Description : the msisdn number for international and non-international numbers.
Non-International formats : num , cc+num
International formats : +cc+num,0+num,00+num,0+cc+num,00+cc+num
// ******************************************************************************************************************************************/
export function msisdnCheck(num,inter_allow,cc,length,text,t)
{
   if(num==""||num==null)
   {
      return t('modules.Generic.errorMsg.enterNum');
   }
   const err = checkAllZeroes(num)
   if(err)
   {
      return err;
   }
   var cc_length=cc.length;
   if(inter_allow==0)
   {
      var RE=/^[0-9]*$/;
      if(!RE.test(num))
      {
         return t('modules.Generic.errorMsg.onlyNum');
      }
      if(num.indexOf(cc)!=0)
      {
         if(num.length!=length)
         {
            return t('modules.Generic.errorMsg.msisdnLenVal',{text:text, length:length, ccAndLength:length+cc.length , cc:cc});
         }
         const err = checkInitialZero(num)
         if (err)
         {           
            return err
         }
      }
      else
      {
         if(num.length!=(length+cc_length))
         {
            return t('modules.Generic.errorMsg.msisdnLenVal',{text:text, length:length, ccAndLength:length+cc.length , cc:cc});
         }
         const err =checkInitialZero(num.substring(cc_length,num.length),text)
         if (err)
         {           
            return err
         }
      }
       return null;
   }
   if(inter_allow==1)
   {
         var cc_all="0,00,0"+cc+",00"+cc+",+"+cc;
         var ccArray=cc_all.split(",");
         var RE=/^[+]?[0-9]*$/;
         var j=0;
         if(!RE.test(num))
         {
            
            return t('modules.Generic.errorMsg.numAndPlus')
         }
         for(var i=0;i<ccArray.length;i++)
         {
            if(num.indexOf(ccArray[i])==0)
            {
               ccSel=ccArray[i];
            }
            else
            {
               j++;
            }
         }
         if(j==ccArray.length)
         {
               return t('modules.Generic.errorMsg.startWithPlusOrZero');
         }
         if(num.length!=length+ccSel.length)
         {
            return t('modules.Generic.errorMsg.startWithPlusOrZeroWithLen',{text:text, len:(length+ccSel.length)});
         }
         const err = checkInitialZero(num.substring(ccSel.length,num.length),text)
         if(err)
         {
            return err;
         }
         return null;
      }
}


// /*---------- PASSWORD VALIDATIONS ---------- */

// /*
// Function Name : passwordValidation
// Input parameters : objVal,min,max,text,alphaFlag,lowerCaseFlag,upperCaseFlag,numericFlag,specialCharFlag,wordBanFlag,sequenceFlag,bannedWords
//    objVal- is the parameter to be validated
//    min- to check the minimum length of objVal
//    max- to check maximum length of objVal
//    text- display name of objVal
//    alphaFlag- is a flag, if true then check presence of atleast one alphabet
//    lowerCaseFlag- is a flag,if true then check presence of atleast one lowercase alphabet
//    upperCaseFlag- is a flag,if true then check presence of atleast one uppercase alphabet
//    numericFlag- is a flag,if true then check presence of atleast one number
//    specialCharFlag- is a flag,if true then check presence of atleast one special character
//    wordBanFlag- is a flag,if true then on presence of bannedWords returns false
//    sequenceFlag-is a flag,if true then on presence of sequential words returns false 
//    bannedWords- is a parameter contains all banned words separated to comma
// Output parameters : true/false
// Description : performs password validation based on above parameters
// */
export function passwordValidation(objVal,min,max,text,alphaFlag,lowerCaseFlag,upperCaseFlag,numericFlag,specialCharFlag,wordBanFlag,sequenceFlag,bannedWords,t)
{
   //var RE=/^[a-zA-Z0-9]+(?=.*\d)(?=.*[a-zA-Z])(?=.*[@#$%])/;
   if(objVal == null || objVal =="")
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text});
   }
   if(objVal.length < min || objVal.length > max)
   {
      return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text});
   }
   if (alphaFlag)
   {
      var RE=/^[a-zA-Z0-9!@#$%^&*]*[a-zA-Z]+[a-zA-Z0-9!@#$%^&*]*$/
      if(!RE.test(objVal))
      {
         return t('modules.Generic.errorMsg.atleastOneAlpha', {text: text});
      }
   }
   if (lowerCaseFlag)
   {
      var RE=/^[a-zA-Z0-9!@#$%^&*]*[a-z]+[a-zA-Z0-9!@#$%^&*]*$/
      if(!RE.test(objVal))
      {
         return t('modules.Generic.errorMsg.atleastOneLower', {text: text});
      }
   }
   if (upperCaseFlag)
   {
      var RE=/^[a-zA-Z0-9!@#$%^&*]*[A-Z]+[a-zA-Z0-9!@#$%^&*]*$/
      if(!RE.test(objVal))
      {
         return t('modules.Generic.errorMsg.atleastOneUpper', {text: text});
      }
   }
   if (numericFlag)
   {
      var RE=/^[a-zA-Z0-9!@#$%^&*]*[0-9]+[a-zA-Z0-9!@#$%^&*]*$/
      if(!RE.test(objVal))
      {
         return t('modules.Generic.errorMsg.atleastOneNum', {text: text});
      }
   }
   if (specialCharFlag)
   {
      var RE=/^[a-zA-Z0-9!@#$%^&*]*[!@#$%^&*]+[a-zA-Z0-9!@#$%^&*]*$/
      if(!RE.test(objVal))
      {
         return t('modules.Generic.errorMsg.atleastOneSpcl', {text: text});
      }
   }
  if(wordBanFlag)
   {
      var words=bannedWords.split(",");
      for(var i=0;i<words.length;i++)
      {
         if(objVal.indexOf(words[i])>=0)
         {
            return t('modules.Generic.errorMsg.bannedWordsNotAllowed');
         }
      }
   }
   if(sequenceFlag)
         {
           var RE=/[a-z]{3,}|[A-Z]{3,}|\d{3,}/;
           if(RE.test(objVal))
            {
               
               return t('modules.Generic.errorMsg.seqNotAllowed');
            }
         }

  return null;
 
}   


// /*----------E-MAIL  VALIDATIONS ---------- */

// /*
// Function Name : emailValidation
// Input parameters : emailId,domainFlag,domainNames
//    emailId-is the parameter to be validated
//    domainFlag- is a flag ,if true checks for proper domain based on domainNames parameter
//    domainNames-is a parameter conatining valid domains
// Output parameters : true/false
// Description : validates emailId with particular format and domain 
// */
export function emailValidation(emailId,domainFlag,domainNames,t)
   {
      RE=/^[a-zA-Z0-9]+[@]+[a-zA-z]{3,5}[.]+[a-zA-z.]{2,7}$/;
      if(emailId == null ||emailId  =="")
      {
         return t('modules.Generic.errorMsg.emailNotEmpty');
      }
      if(!RE.test(emailId))
      {
         return t('modules.Generic.errorMsg.invalidEmailFormat');
      }
      else
      {
         if(domainFlag)
         {
            var domain=domainNames.split(",");
            for(var i=0;i<domain.length;i++)
            {
               if(emailId.indexOf(domain[i])>=0)
               {
                  return null;
               }
            }
            return t('modules.Generic.errorMsg.invalidDomian');
         }
      }
      return null;
   }

//***************************************************************************************************************************************** */
export function validateEmailValue(addr1,text,t)
{
        var addr=trim(addr1);

        if(addr != "")
        {
                var invalidChars = '\/\'\\ ";:?!()[]\{\}^|,<>+=-*&%$#~`';
                for (let i=0; i<invalidChars.length; i++)
                {
                        if (addr.indexOf(invalidChars.charAt(i),0) > -1)
                        {
                                //addr1.focus();
                                return  t('modules.Generic.errorMsg.invalidChars',{text:text});
                        }
                }
                for (let i=0; i<addr.length; i++)
                {
                        if (addr.charCodeAt(i)>127)
                        {
                                //addr1.focus();
                                return t('modules.Generic.errorMsg.asciiChars',{text:text});
                        }
                }
                var atPos = addr.indexOf('@',0);
                if (atPos == -1)
                {
                        //addr1.focus();
                        return t('modules.Generic.errorMsg.contain@',{text:text});
                }
                if (atPos == 0)
                {
                        //addr1.focus();
                        return t('modules.Generic.errorMsg.notStartWith@',{text:text});
                }
                if (addr.indexOf('@', atPos + 1) > - 1)
                {
                        //addr1.focus();
                        return t('modules.Generic.errorMsg.containOne@',{text:text});
                }
                if (addr.indexOf('.', atPos) == -1)
                {
                        //addr1.focus();
                        return t('modules.Generic.errorMsg.containPeriod',{text:text});
                }
                if (addr.indexOf('@.',0) != -1)
                {
                        //addr1.focus();
                        return t('modules.Generic.errorMsg.notImmediate@',{text:text});
                }
                if (addr.indexOf('.@',0) != -1)
                {
                        //addr1.focus();
                        return t('modules.Generic.errorMsg.notImmediatePrecede',{text:text});
                }
                if (addr.indexOf('..',0) != -1)
                {
                        //addr1.focus();
                        return t('modules.Generic.errorMsg.noAdjacentPeriods',{text:text});
                }
                var suffix = addr.substring(addr.lastIndexOf('.')+1);
                if (suffix.length != 2 && suffix != 'com' && suffix != 'net' && suffix != 'org' && suffix != 'edu' && suffix != 'int' && suffix != 'mil' && suffix != 'gov' & suffix != 'arpa' && suffix != 'biz' && suffix != 'aero' && suffix != 'name' && suffix != 'coop' && suffix != 'info' && suffix != 'pro' && suffix != 'museum')
                {
                        //addr1.focus();
                        return t('modules.Generic.errorMsg.invalidPrimaryDomain',{text:text});
                }

        }
        return null;
}
/************************************************************************************************************************************** */
export function checkempty(obj,text,t)
{
        var val=obj.value;
        if ((val =="") || (val == null))
        {              
                //obj.focus();
                return t('modules.Generic.errorMsg.mandatory',{text:text});
        }
        return null;
}

/************************************************************************************************************************************* */
export function validateEmail(addr1,text,opt)
{
        var addr=addr1.value;
        if(opt)
        {
                const err = checkempty(addr1,text)
                if(err)
                {
                        return err;
                }
        }
        if(opt==1||(opt==0 && addr1.value != ""))
        {
                var invalidChars = '\/\'\\ ";:?!()[]\{\}^|,<>+=-*&%$#~`';
                for (i=0; i<invalidChars.length; i++)
                {
                        if (addr.indexOf(invalidChars.charAt(i),0) > -1)
                        {
                                //alert(text + ' contains invalid characters');
                                addr1.focus();
                                return  t('modules.Generic.errorMsg.invalidChars',{text:text});
                        }
                }
                for (i=0; i<addr.length; i++)
                {
                        if (addr.charCodeAt(i)>127)
                        {
                                //alert(text + " contains non ascii characters.");
                                addr1.focus();
                                return  t('modules.Generic.errorMsg.asciiChars',{text:text});
                        }
                }
                var atPos = addr.indexOf('@',0);
                if (atPos == -1)
                {
                        //alert(text + ' must contain an @');
                        addr1.focus();
                        return t('modules.Generic.errorMsg.contain@',{text:text});
                }
                if (atPos == 0)
                {
                        //alert(text + ' must not start with @');
                        addr1.focus();
                        return t('modules.Generic.errorMsg.notStartWith@',{text:text});
                }
                if (addr.indexOf('@', atPos + 1) > - 1)
                {
                        //alert(text + ' must contain only one @');
                        addr1.focus();
                        return t('modules.Generic.errorMsg.containOne@',{text:text});
                }
                if (addr.indexOf('.', atPos) == -1)
                {
                        //alert(text + ' must contain a period in the domain name');
                        addr1.focus();
                        return t('modules.Generic.errorMsg.containPeriod',{text:text});
                }
                if (addr.indexOf('@.',0) != -1)
                {
                        //alert('period must not immediately follow @ in '+text);
                        addr1.focus();
                        return t('modules.Generic.errorMsg.notImmediate@',{text:text});
                }
                if (addr.indexOf('.@',0) != -1)
                {
                        //alert('period must not immediately precede @ in '+text);
                        addr1.focus();
                        return false;
                }
                if (addr.indexOf('..',0) != -1)
                {
                        //alert('two periods must not be adjacent in '+text);
                        addr1.focus();
                        return t('modules.Generic.errorMsg.notImmediatePrecede',{text:text});
                }
                var suffix = addr.substring(addr.lastIndexOf('.')+1);
                if (suffix.length != 2 && suffix != 'com' && suffix != 'net' && suffix != 'org' && suffix != 'edu' && suffix != 'int' && suffix != 'mil' && suffix != 'gov' & suffix != 'arpa' && suffix != 'biz' && suffix != 'aero' && suffix != 'name' && suffix != 'coop' && suffix != 'info' && suffix != 'pro' && suffix != 'museum')
                {
                        //alert('invalid primary domain in '+text);
                        addr1.focus();
                        return t('modules.Generic.errorMsg.invalidPrimaryDomain',{text:text});
                }
        }
        return null;
}


// /*----------DATE AND TIME VALIDATIONS ---------- */

// /*
// Function Name : checkWithCurrentDateTime
// Input parameters : fdate,text,flag
//    fdate-is the parameter to be validated
//    text- is display name for fdate
//    equiFlag- if true checks fdate less than and equals to current date and time, if false checks fdate less than current date and time
//    countFlag- if true checks whether the difference between fdate and current is count or not
//    count- number of days(difference between fdate and currentDate)allowed
// Output parameters : true/false
// Description : compares date and time of objVal with current date and time
// */
export function checkWithCurrentDateTime(fdate,text,equiFlag,countFlag,count,t)
{
        if(fdate == "")
        {
               //  alert("Please select "+text);
                return t('modules.Generic.errorMsg.pleaseSelect',{text:text});
        }
        var findex = fdate.indexOf("/");
        var lindex = fdate.lastIndexOf("/");
        var fdd= parseInt(fdate.substring(0,findex),10);
        var fmonth=parseInt(fdate.substring(findex+1,lindex),10);
        var fyear=parseInt(fdate.substring(lindex+1,lindex+5),10);
        findex=fdate.indexOf(":");
        var fhh=parseInt(fdate.substring(lindex+6,findex),10);
        lindex = fdate.lastIndexOf(":");
        var fmin=parseInt(fdate.substring(findex+1,lindex),10);
        var fsec=parseInt(fdate.substring(lindex+1,fdate.length),10);
        var tempdat = new Date();
        var curdat = new Date(tempdat.getFullYear(),tempdat.getMonth(),tempdat.getDate());
        var seldat = new Date(fyear,fmonth-1,fdd,fhh,fmin,fsec);
        if(equiFlag)
        {
            if((seldat > curdat))
            {
                return t('modules.Generic.errorMsg.lessThanCurDate',{text:text});
            }
        }
        else
        {
            if(!(seldat < curdat))
            {
                return t('modules.Generic.errorMsg.lessThanCurDate',{text:text});
            }
        }
        if(countFlag)
        {
            var returnVal=countDateDiff(seldat,curdat,count);
            if(returnVal){
               return returnVal;
            }
        }
        return null;
}

// /*
// Function Name : checkDateTimeDiff
// Input parameters : ffdate,tfdate,ftext,ttext
//    ffdate- should contain from date and time
//    tfdate- should contain to date and time
//    ftext- is display name for ffdate
//    ttext- is display name for tfdate
//    countFlag- if true checks whether the difference between ffDate and tfdate is count or not
//    count- number of days(difference between ffdate and tfdate)allowed
// Output parameters : true/false
// Description : comapres ffdate with tfdate
// */
export function checkDateTimeDiff(ffdate,tfdate,ftext,ttext,countFlag,count,t)
{
        if(ffdate =="" || ffdate == "null" || ffdate =="undefined")
         {
               //  alert("Please select "+ftext);
                return t('modules.Generic.errorMsg.selectFromDate',{ftext:ftext});
         }
        if(tfdate =="" || tfdate =="null" || tfdate =="undefined")
         {
               //  alert("Please select "+ttext);
                return t('modules.Generic.errorMsg.selectToDate',{ttext:ttext});
         }
        var ffindex = ffdate.indexOf("/");
        var flindex = ffdate.lastIndexOf("/");
        var ffdd= parseInt(ffdate.substring(0,ffindex),10);
        var ffmonth=parseInt(ffdate.substring(ffindex+1,flindex),10);
        var ffyear=parseInt(ffdate.substring(flindex+1,flindex+5),10);
        ffindex=ffdate.indexOf(":");
        var ffhh=parseInt(ffdate.substring(flindex+6,ffindex),10);
        flindex = ffdate.lastIndexOf(":");
        var ffmin=parseInt(ffdate.substring(ffindex+1,flindex),10);
        var ffsec=parseInt(ffdate.substring(flindex+1,ffdate.length),10);
        var ftempdat = new Date();
        var fseldat = new Date(ffyear,ffmonth-1,ffdd,ffhh,ffmin,ffsec);
        var tfindex = tfdate.indexOf("/");
        var tlindex = tfdate.lastIndexOf("/");
        var tfdd= parseInt(tfdate.substring(0,tfindex),10);
        var tfmonth=parseInt(tfdate.substring(tfindex+1,tlindex),10);
        var tfyear=parseInt(tfdate.substring(tlindex+1,tlindex+5),10);
        tfindex=tfdate.indexOf(":");
        var tfhh=parseInt(tfdate.substring(tlindex+6,tfindex),10);
        tlindex = tfdate.lastIndexOf(":");
        var tfmin=parseInt(tfdate.substring(tfindex+1,tlindex),10);
        var tfsec=parseInt(tfdate.substring(tlindex+1,tfdate.length),10);
        var ttempdat = new Date();
        var tseldat = new Date(tfyear,tfmonth-1,tfdd,tfhh,tfmin,tfsec);
        if(!(tseldat > fseldat))
        {
               //  alert(ttext+" should be greater than  "+ftext);

               return t('modules.Generic.errorMsg.dateGreaterThan',{ftext:ftext,ttext:ttext});
        }
        if(countFlag)
        {
            var returnVal=countDateDiff(fseldat,tseldat,count);
            if(returnVal){
               return returnVal;
            }
        }
        return null;
}


// /******************* DATE VALIDATIONS *******************/

// /*
// Function Name : checkWithCurrentDate
// Input parameters : fromDate,text,countFlag,count
//    fromDate-is the parameter to be validated
//    text- is display name for fromDate
//    countFlag- if true checks whether the difference between fromDate and current is count or not
//    count- number of days(difference between fromDate and currentDate)allowed
// Output parameters : true/false
// Description : compares fromDate with current date and counts number of days difference if required
// */
export function checkWithCurrentDate(fromDate,text,countFlag,count)
{
        if(fromDate==null|| fromDate=="")
         {
            return t('modules.Generic.errorMsg.pleaseSelect',{text:text});

         }
        var curDate = new Date();
        var dd=fromDate.substring(0,fromDate.indexOf("/"));
        var mm=fromDate.substring(fromDate.indexOf("/")+1,fromDate.lastIndexOf("/"));
        var yy=fromDate.substring(fromDate.lastIndexOf("/")+1,fromDate.length);
        var tmpdat = new Date(curDate.getFullYear(),curDate.getMonth(),curDate.getDate());
        var seldat = new Date(yy,mm-1,dd);
        if(seldat>tmpdat)
        {
                return t('modules.Generic.errorMsg.dateNotGreaterThan',{text:text});

        }
        if(countFlag)
        {
            var returnVal=countDateDiff(seldat,tmpdat,count);
            if(returnVal){
               return returnVal;
            }
        }
        return null;
}

/*
Function Name : FromAndToDateCompare
Input parameters : from,to,countFlag,count 
   from-is from or start date
   to- is to or end date
   countFlag- if true checks whether the difference between from and to date is count or not
   count- number of days(difference between from and to date)allowed
Output parameters : true/false
Description : compares fromand to date and count number of days if required
*/
export function FromAndToDateCompare(from,to,countFlag,count,t)
{
        if(from==null|| from=="")
         {
            return t('modules.Generic.errorMsg.selectFromDt')
         }
        if(to==null|| to=="")
         {
            return  t('modules.Generic.errorMsg.selectToDt');
         }
        var fdd=from.substring(0,from.indexOf("/"));
        var fmm=from.substring(from.indexOf("/")+1,from.lastIndexOf("/"));
        var fyy=from.substring(from.lastIndexOf("/")+1,from.length);
        var tdd=to.substring(0,to.indexOf("/"));
        var tmm=to.substring(to.indexOf("/")+1,to.lastIndexOf("/"));
        var tyy=to.substring(to.lastIndexOf("/")+1,to.length);
        var selFrom = new Date(fyy,fmm-1,fdd);
        var selTo = new Date(tyy,tmm-1,tdd);
        if(selFrom>selTo)
        {
                return  t('modules.Generic.errorMsg.fromNotGreaterThanTo');
        }
        if(countFlag)
        {
            var returnVal=countDateDiff(selFrom,selTo,count);
            if(returnVal){
               return returnVal;
            }
        }
        return null;
}

/*
Function Name : countDateDiff 
Input parameters : fromdat,todat,count
   fromdat-is from or start date
   todat- is to or end date
   count- number of days(difference between fromdat and todat date)allowed
Output parameters : true/false
Description : Counts number of days difference between fromdat and todat
*/
export function countDateDiff(fromdat,todat,count,t)
{
        if((parseInt(todat-fromdat)/86400000)>count)
        {
                return t('modules.Generic.errorMsg.dateDifferenceLimit',{count:count});
        }
        return null;
}

// /*
// Function Name : checkSelDateBetweenFromAndToDate
// Input parameters : fromDate,toDate,selDate,text
//    fromDate-is from or start date
//    toDate- is to or end date
//    selDate- is given input date
//    text- display name for selDate
// Output parameters : true/false
// Description : checks whether given date(selDate) is between from date and to date
// */
export function checkSelDateBetweenFromAndToDate(fromDate,toDate,selDate,text,t)
{
        if(fromDate=="" || fromDate ==null)
         {
            return t('modules.Generic.errorMsg.selectStartDt');
         }
        if(toDate=="")
         {
            return t('modules.Generic.errorMsg.selectEndDt');
         }
        if(selDate=="")
         {
            return t('modules.Generic.errorMsg.selectDt');
         }
        var fdate = fromDate;
        var ffindex = fdate.indexOf("/");
        var flindex = fdate.lastIndexOf("/");
        var fdd= parseInt(fdate.substring(0,ffindex),10);
        var fmonth=parseInt(fdate.substring(ffindex+1,flindex),10);
        var fyear=parseInt(fdate.substring(flindex+1,flindex+5),10);
        var fseldat = new Date(fyear,fmonth-1,fdd);
        var tdate = toDate;
        var tfindex = tdate.indexOf("/");
        var tlindex = tdate.lastIndexOf("/");
        var tdd= parseInt(tdate.substring(0,tfindex),10);
        var tmonth=parseInt(tdate.substring(tfindex+1,tlindex),10);
        var tyear=parseInt(tdate.substring(tlindex+1,tlindex+5),10);
        var tseldat = new Date(tyear,tmonth-1,tdd);
        var sdate = selDate;
        var sfindex = sdate.indexOf("/");
        var slindex = sdate.lastIndexOf("/");
        var sdd= parseInt(sdate.substring(0,sfindex),10);
        var smonth=parseInt(sdate.substring(sfindex+1,slindex),10);
        var syear=parseInt(sdate.substring(slindex+1,slindex+5),10);
        var sseldat = new Date(syear,smonth-1,sdd);
        if((sseldat < fseldat) || (sseldat > tseldat))
        {
                return t('modules.Generic.errorMsg.dateRange',{text:text,fromDate:fromDate, toDate:toDate });
        }
        return null;
}


// /*********** OTHER VALIDATIONS *****************/

// /*
// Function Name : checkInitialZero 
// Input parameters : objVal,text
//    objVal-is the parameter to be validated
//    text-display name of objVal
// Output parameters : true/false
// Description : checks value starting with zero 
// */
export function checkInitialZero(objVal,text,t)
{
        if(objVal.toString().charAt(0)== "0")
        {
            return t('modules.Generic.errorMsg.notStartWithZero',{text:text});
        }
        else
            return null;
}

// /*
// Function Name : checkAllZeroes
// Input parameters : objVal
//  objVal-is the parameter to be validated
// Output parameters : true/false
// Description : returns false if objVal contains only zeros
// */
function checkAllZeroes(objVal,t)
{
        var i;
        for(i=0;i<objVal.length;i++)
        {
                if(objVal.toString().charAt(i)!="0")
                        break;
        }
        if(i==objVal.length)
                return t('modules.Generic.errorMsg.cannotBeZero');
        else
                return null;
}

// /*
// Function Name : checkNull
// Input parameters : objVal,text
//    objVal-is the parameter to be validated
//    text-display name of objVal 
// Output parameters : true/false
// Description : check for null
// */
export function checkNull(objVal,text,t)
{
   if(objVal== "" || objVal ==null)
   {     
      return t('modules.Generic.errorMsg.mandatory', {text: text});
   }
   return null;
}

// /*
// Function Name : checkNullAndLength
// Input parameters : objVal,min,max,text
//    objVal-is the parameter to be validated
//    min-to check the minimum length of objVal
//    max-to check maximum length of objVal
//    text-display name of objVal
// Output parameters : true/false
// Description : checks for null and also length
// */
export function checkNullAndLength(objVal,min,max,text)
{
   if(objVal== "" || objVal ==null)
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text});
   }
   if(objVal.length < min || objVal.length > max)
   {
      return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text});
   }
   return null;
}

// /*
// Function Name : validateSelectboxCheck 
// Input parameters : obj,text
//    obj-is the object whose value is to be validated
//    text-display name of obj
// Output parameters : true/false
// Description : check if value selected or not from select box
// */
export function validateSelectboxCheck(obj,text,t)
{
        if(obj.options[obj.selectedIndex].value=='-1')
        {
                return t('modules.Generic.errorMsg.pleaseSelect',{text:text});
        }
        else
                return null;
}

// /*
// Function Name : trim
// Input parameters : value
//    value-is the parameter to be validated
// Output parameters : true/false
// Description : removing spaces from begining and end of value
// */
export function trim(value)
{
        var RE = /^(\s*)$/;
        if(RE.test(value)) //if value containing only space,replace with ''
        {
                value = value.replace(RE, '');
                if(value.length == 0)
                        return value;
        }
        RE = /^(\s*)([\W\w]*)(\b\s*$)/;
        if(RE.test(value)) //removes space from start and end if present
        {
                value = value.replace(RE,'\$2');
        }
        return value;
}

// /*
// Function Name : stringTokenCount
// Input parameters : objVal,text,delim
//    objVal- parameter to be validated
//    text- display name for objVal
//    delim- specify delimiter
// Output parameters : true/false
// Description : counts number of token separated by delim
// */
export function AlphaNumeralSpecialText(objVal,text,min,max,t)
{
        var cnt=objVal.length;
        // var RE= /^[a-zA-Z0-9.]$/;
        var RE= /^[a-zA-Z]+[\_\.,a-zA-Z0-9]*$/;
        if(objVal=="" ||objVal==null)
        {
                return t('modules.Generic.errorMsg.shouldNotBeNull', {text: text});
        }
        if(objVal.charAt(0)==0)
        {
           return  t('modules.Generic.errorMsg.notStartWithZero', {text: text});
        }
        if(!RE.test(objVal))
        {
            return t('modules.Generic.errorMsg.alphaNumWithSpcl', {text: text});;
        }
        if(objVal.length < min || objVal.length > max)
        {
            return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text});
        }
return null;
}

// //alphanumeric validation with only . as a special character allowed
export function validateHSSHost(objVal,text,min,max,t)
{
        var cnt=objVal.length;
        var RE= /^([\w,|#\&\s\-\.\$\(\)])+$/;
        if(objVal=="" ||objVal==null)
        {
                return t('modules.Generic.errorMsg.shouldNotBeNull', {text: text});
        }
        if(objVal.charAt(0)==0)
        {
           return t('modules.Generic.errorMsg.notStartWithZero', {text: text});
        }
        if(!RE.test(objVal))
        {
            return  t('modules.Generic.errorMsg.invalidHssHost', {text: text});
         };
        
        if(objVal.length < min || objVal.length > max)
        {
         return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text});
      }
   return null;
}

// //ip and host validation with only . as a special character allowed
export function validateIPAddr(objVal,text,min,max,t)
{
        var cnt=objVal.length;
        var RE= /^[a-zA-Z0-9]+[\.a-zA-Z0-9]*$/;
        if(objVal=="" ||objVal==null)
        {
         return t('modules.Generic.errorMsg.shouldNotBeNull', {text: text});
        }
        if(objVal.charAt(0)==0)
        {
         return t('modules.Generic.errorMsg.notStartWithZero', {text: text});
        }
        if(!RE.test(objVal))
        {
         return t('modules.Generic.errorMsg.alphaNumWithDot', {text: text});
        }
        RE = /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/;
        if(!RE.test(objVal))
        {
            return t('modules.Generic.errorMsg.mandatoryidIP', {text: text});;
        }
        if(objVal.length < min || objVal.length > max)
        {
         return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text});
        }
return null;
}

// //validates Ip address as well as host name
export function validateIPHost(objVal,text,t)
{
        var cnt=objVal.length;
        var flag=0;
        // var RE= /^[a-zA-Z0-9.]$/;
        var RE= /^[a-zA-Z]+[\_\.a-zA-Z0-9]*$/;
        if(objVal=="" ||objVal==null)
        {
                flag=1;
                 //return false;
        }
        if(objVal.charAt(0)==0)
        {
           flag=1;
           //return false;
        }
        if(!RE.test(objVal))
        {
           // alert(text+" should have only alphanumerals (.,_ allowed).");
            flag=1;
            //return false;
        }
        RE = /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/;
        if(!RE.test(objVal))
        {
           //alert("Please enter valid "+txt);
           flag=flag+1;
           //return false;
        }
        if(flag >=2)
        {
           return t('modules.Generic.errorMsg.mandatoryid', {text: text});
        }
        else
        {
           return null;
        }

}

export function stringTokenCountText(objVal,text,delim,min,max,t)
{
        var cnt=objVal.length;
        // var RE= /^[a-zA-Z0-9.]$/;
        var RE= /^[a-zA-Z]+[\_\.a-zA-Z0-9]*$/;
        if(objVal=="" ||objVal==null)
        {
                return t('modules.Generic.errorMsg.shouldNotBeNull', {text: text});
        }
        if(objVal.indexOf(delim)==0)
        {
          return t('modules.Generic.errorMsg.notStartWithDelim', {text: text, delim : delim});
        }
        if(objVal.lastIndexOf(delim)==(cnt-1))
        {
         return t('modules.Generic.errorMsg.notEndtWithDelim', {text: text, delim : delim});
        }

        var objValarray = objVal.split(delim)
                for(var i=0;i<objValarray.length;i++)
                {
                        if(objValarray[i].charAt(0)==0)
                        {
                           return t('modules.Generic.errorMsg.notStartWithZero', {text: text});
                        }
                        if(!RE.test(objValarray[i]))
                        {
                           return t('modules.Generic.errorMsg.alphaNumWithSpcl', {text: text});
                        }
                        if(objValarray[i].length < min || objValarray[i].length > max)
                        {
                           return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text});
                        }
                }
        return null;
}


export function stringTokenCountCCDyna(obj,text,delim,min,max,t)
{
    var str=obj;
    var cnt=str.length;
    var cnt1=1;
    var RE = /^[0-9]+$/; 

    if(str=="" ||str==null)
    {
        return t('modules.Generic.errorMsg.shouldNotBeNull', {text: text});
    }
    if(str.indexOf(delim)==0)
    {
        return t('modules.Generic.errorMsg.notStartWithDelim', {text: text, delim : delim});
    }
    if(str.lastIndexOf(delim)==(cnt-1))
    {
        return t('modules.Generic.errorMsg.notEndtWithDelim', {text: text, delim : delim});
    }
    var cc_ndcArr = obj.split(delim)
    for(var i=0;i<cc_ndcArr.length;i++)
    {
        if(!RE.test(cc_ndcArr[i]))
        {
            return t('modules.Generic.errorMsg.numeric', {text: text});
        }
        var tmp=cc_ndcArr[i].length
        if(parseInt(tmp) <  min || parseInt(tmp) > max)
        {
           return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text});
        }
    }
    return null;
}


export function stringTokenCountvmsc(obj,text,delim,min,max,t)
{
    var str=obj;
    var cnt=str.length;
    var cnt1=1;
    var RE= /^[0-9]{1,20}$/;
    var RE1=/^[\*]{0,18}$/;

    if(str=="" || str==null)
    {
        return t('modules.Generic.errorMsg.shouldNotBeNull', {text: text});
    }
    if(str.indexOf(delim)==0)
    {
        return t('modules.Generic.errorMsg.notStartWithDelim', {text: text, delim : delim});
    }
    if(str.lastIndexOf(delim)==(cnt-1))
    {
        return t('modules.Generic.errorMsg.notEndtWithDelim', {text: text, delim : delim});
    }
    var cc_ndcArr = obj.split(delim)
    for(var i=0;i<cc_ndcArr.length;i++)
    {
        var length=cc_ndcArr[i].length;
        if(cc_ndcArr[i].indexOf('*') >= 0)
        {
            var firststring=cc_ndcArr[i].substring(0, cc_ndcArr[i].indexOf('*'));
            var laststring=cc_ndcArr[i].substring(cc_ndcArr[i].indexOf('*')+1,length);
            if(!RE1.test(laststring))
            {
                return t('modules.Generic.errorMsg.numericWithspclcharacter', {text: text});
            }
        }
        else
            firststring=cc_ndcArr[i];
        if(!RE.test(firststring))
        {
            return t('modules.Generic.errorMsg.Addressnumeric', {text: text,min:min, max:max});
        }
        if(parseInt(length) < min||parseInt(length) > max)
        {
            return t('modules.Generic.errorMsg.Addressnumeric', {text: text,min:min, max:max});
        }
    }
    return null;
}


export function checkOp(obj,min,max,text,t)
{
    var RE=/^[a-zA-Z0-9][a-zA-Z0-9\&\-\s]+$/;
    if(obj == "" || obj == null)
    {
        return t('modules.Generic.errorMsg.mandatory', {text: text});
    }
    if(obj.length < min || obj.length > max)
    {
        return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
    }
    if(!RE.test(obj))
    {
        return t('modules.Generic.errorMsg.checkAlphawithSpecialcharacters', {min:min , max:max, text:text})
    }
    return null;
}


// /*
// Function Name : textCounter
// Input parameters : field,cntfield,maxlimit
//    field- here the text is entered
//    cntfield- decreements this field as the letters are entered in text area
//    maxlimit- tells the maxlimit of text area to enter text
// Output parameters : true/false
// Description : this function count the number of characters entered in text area,of certain maxlimit. If limit exceeds then counts as second message concatinated with previous message.
// */
// export function textCounter(field,cntfield,maxlimit) 
// {
//    if (field.length > maxlimit)
//       field = (field.substring(0, maxlimit));
//    else
//    {            
//       if(field.length >160 && field.length<=306)
//       {
//          cntfield = (maxlimit - field.length)+"/"+"2";
//       }
//       else if(field.length>306)
//       {
//          cntfield = (maxlimit - field.length)+"/"+"3";
//       }
//       else
//       {
//          cntfield = (maxlimit - field.length)+"/"+"1";
//       }
//     }
// }


// /*
// Function Name : textCounter
// Input parameters : field,remLen,lang,maxlimit,keyP,event
//    field- here the text is entered
//    cntfield- decreements this field as the letters are entered in text area
//    maxlimit- tells the maxlimit of text area to enter text
// Output parameters : true/false
// Description : this function count the number of characters entered in text area,of certain maxlimit. If limit exceeds then counts as second message concatinated with previous message.
// */
export function textCounter(field,remLen,lang,maxlimit,keyP,event) {
        var chkPlaceholders=field.value;
        var actLen=0;
        var removePlcH=0;
        var oldRemLen="";
        var tmpLen=0;
        var newLen=0;
        var lastPlceHolder=0;
        var placeHVal="";
        var restrictValue=0;

        var placeHolders=["_$transid$_","_$msisdn$_","_$pkgkey$_","_$pkgname$_","_$description$_","_$validity$_","_$expiry$_","_$amount$_"];

         //alert(placeHolders);
        oldRemLen=remLen.value;

        //         alert(remLen.value);
        if((keyP==2)&&((remLen.value)>=parseInt(maxlimit)) &&(event.keyCode==32))
        {
                return false;
        }
        if(restrictValue==0)
        {
                newLen=calLength(field.value,remLen,lang,maxlimit,keyP);
                // alert("newLen is...."+newLen+"maxlimit is ..."+maxlimit);

                if((maxlimit!=-1) && parseInt(newLen)>parseInt(maxlimit))
                {
                        for(var i=0;i<placeHolders.length;i++)
                        {
                                if(chkPlaceholders.lastIndexOf(placeHolders[i])>0)
                                {
                                        removePlcH=chkPlaceholders.length-parseInt(placeHolders[i].length+1);
                                        // alert('chkPlaceholders.lastIndexOf(placeHolders[i])..'+chkPlaceholders.lastIndexOf(placeHolders[i])+'..removePlcH....'+removePlcH);
                                        if(chkPlaceholders.lastIndexOf(placeHolders[i])==removePlcH)
                                        {
                                                lastPlceHolder=1;
                                                placeHVal=placeHolders[i];
                                        }
                                }

                        }
                        if(lastPlceHolder==1)
                        {
                                chkPlaceholders=chkPlaceholders.substring(0,chkPlaceholders.lastIndexOf(placeHVal));
                                newLen=oldRemLen;

                        }
                        else
                        {
                                while(newLen>maxlimit)
                                {
                                        chkPlaceholders=chkPlaceholders.substring(0,(chkPlaceholders.length-1));
                                        newLen--;

                                        newLen=calLength(chkPlaceholders,remLen,lang,maxlimit,keyP);

                                }
                        }

                        field.value=chkPlaceholders;
                        remLen.value=newLen;
                }
                else
                {
                        remLen.value=newLen;
                }
        }

}

export function textCounterBinary(field,cntfield,maxlimit,obj)
{

        var txtVal1=0;
        var txtVal=field.value.replace(/\s/g,"");
        if(obj!=undefined)
        {
                txtVal1=obj.value.replace(/\s/g,"");
        }
        else
        {
                txtVal1="";
        }
        var txtLen=Math.ceil(((parseInt(txtVal.length))+(parseInt(txtVal1.length)))/2);

        var tottxtLen=Math.ceil(txtLen);

        var txtLen1=(140*3-1);
        if (tottxtLen > 140){
                //field.value = (txtVal.substring(0, maxlimit));
                cntfield.value = "0/"+"1";
                field.value = (field.value.substring(0,txtLen1-obj.value.length));
        }
        else
        {
                cntfield.value = (maxlimit - Math.ceil(txtVal.length/2))+"/"+"1";
        }
}

export function textCounterUnicode(field,cntfield,maxlimit)
{
        var txtVal=field.value.replace(/\s/g, "");
        var txtLen=Math.ceil((parseInt((txtVal.length)/4)));
        var txtLen1=(201*5-1);
        if (field.value.length > txtLen1){
                cntfield.value = "0/"+"3";
                field.value = (field.value.substring(0,txtLen1));
        }
        else
        {

                if(txtLen >70 && txtLen<135)
                {
                        cntfield.value = (maxlimit - txtLen)+"/"+"2";
                }
                else if(txtLen>=135)
                {
                        cntfield.value = (maxlimit - txtLen)+"/"+"3";
                }
                else
                {
                        cntfield.value = (maxlimit - txtLen)+"/"+"1";
                }

        }
}



// /*
// Function Name : fileExtensionCheck
// Input parameters : objVal,extension 
//    objVal- filename for which extension is to be validated
//    extension- contains list of extensions separated by comma
// Output parameters : true/false
// Description : this function tells whether the extension is valid or not.
// */
export function fileExtensionCheck(objVal,extension)
{
   var extArray=extension.split(",");
   for(var i=0;i<extArray.length;i++)
   {
     if((objVal.substring(objVal.indexOf('.'),objVal.length))==extArray[i])
      {
         return true;
      }
   }
   return false;
}

// /*
// Function Name : validateIP
// Input parameters : ipAddr
//    ipAddr - this is the parameter to be validated
// Output parameters : true/false
// Description : this function tells whether the given IP is valid or not.
// */
export function validateIP(ipAddr,text,t)
{
   var RE = /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/;
   if(!RE.test(ipAddr))
   {
      return t('modules.Generic.errorMsg.mandatoryid', {text: text});
   }
   return null;
}
// /* IP address validation */

export function checkPort(obj,min,max,text,t)
{
         var RE = /^\d+$/;
      if(obj.value == "")
      {
         return t('modules.Generic.errorMsg.mandatory', {text: text})
      }
      if(!RE.test(obj.value))
      {
         return t('modules.Generic.errorMsg.numeric', {text: text})
      }
        if((obj.value.charAt(0) == "0"))
        {
            return t('modules.Generic.errorMsg.validNumWithoutZeroInitially', {text: text})
         }
      if(obj.value.length < min || obj.value.length > max)
      {
         return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
      }
   return null;
}
// /*
// Function Name : stringTokenCount 
// Input parameters : obj,text,delimiter
//    obj - this is the parameter to be validated
// Output parameters : true/false
// Description : this function tells whether the given CCNDC/comma sperated CCNDC is valid or not.
// */
export function stringTokenCount(obj,text,delim,min,max,t)
{
	var str=obj;
	var cnt=str.length;
	var cnt1=1;
	var RE = /^[0-9]+$/; 
	//   var RE= /^[0-9]{1,20}$/;
	// var RE= /^[0-9][0-9]$/;
	if(str=="" ||str==null)
	{
		return t('modules.Generic.errorMsg.shouldNotBeNull', {text: text});
	
	}
	if(str.indexOf(delim)==0)
	{
		return t('modules.Generic.errorMsg.notStartWithDelim', {text: text, delim : delim});
	}
	if(str.lastIndexOf(delim)==(cnt-1))
	{
	return t('modules.Generic.errorMsg.notEndtWithDelim', {text: text, delim : delim});
	}
	var cc_ndcArr = obj.split(delim)
	for(var i=0;i<cc_ndcArr.length;i++)
	{
		if(cc_ndcArr[i].charAt(0)==0)
		{
		return  t('modules.Generic.errorMsg.notStartWithZero', {text: text});
		}
		if(!RE.test(cc_ndcArr[i])) 
		{
			return t('modules.Generic.errorMsg.numeric', {text: text});
		}
		if(cc_ndcArr[i].length < min || cc_ndcArr[i].length > max)
		{
			return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text});
		}
	}
		return null;
}

// // ------- To check length of entered text -----------------
export function checkMsgLen(obj,text,lang,len,t)
{
        var language="";
        if(lang==1)
        {
                language='English';
        }
        else
        {
                language='Arabic';
        }
        if((parseInt(obj))>(parseInt(len)))
        {
                return t('modules.Generic.errorMsg.langTextLen', {text:text,len:len , language:language});
        }
        return null;
}

// // ------ To check whether input is numerical or not -- 
export function checknumber(obj,min,max,text,t)
{
        var RE = /^\d+$/;
                if(obj == "")
                {
                  return t('modules.Generic.errorMsg.mandatory', {text: text})
                }
                if(!RE.test(obj))
                {
                  return t('modules.Generic.errorMsg.numeric', {text: text})
                }
                if(obj < min || obj > max)
                {
                  return t('modules.Generic.errorMsg.valueBetween', {min:min , max:max, text:text});
                }
        return null;
}

export function checkSelectboxCheck(obj,text,t)
{

        if(obj.options[obj.selectedIndex].value=='-1')
        {
         return t('modules.Generic.errorMsg.pleaseSelect', {text: text})
        }
        else
        return null;

}

export function checkSelectboxCheckDiff(obj,val,text,t)
{

        if(obj.options[obj.selectedIndex].value==val)
        {
         return t('modules.Generic.errorMsg.pleaseSelect', {text: text})
        }
        else
                return null;

}

export function checkMinusValue(val,text,t)
{
        if(val=='-1')
        {
         return t('modules.Generic.errorMsg.pleaseSelect', {text: text})
        }
        return null;

}


export function checkKeyword(obj,min,max,text,t)
{

        RE=/^[a-zA-Z0-9][a-zA-Z0-9\_\-]+$/;
        if(obj.value.length < min || obj.value.length > max)
        {
         return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
        }
        return null;
}

export function checkNumHour(obj,min,max,text,t)
{
        var RE = /^\d+$/;
        if(obj== "")
        {
            return t('modules.Generic.errorMsg.mandatory', {text:text})
                
        }
        if(!RE.test(obj))
        {
            return t('modules.Generic.errorMsg.numeric', {text:text})
        }

        if(obj!="0")
        {
                if((obj.charAt(0) == "0"))
                {
                  return t('modules.Generic.errorMsg.validNumWithoutZeroInitially', {text: text})
                }
        }

        if(eval(obj) < min || eval(obj) > max)
        {
         return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
        }

        return null;
}



export function checkHour(obj,text,t)
{
        var RE1 = /^\d+$/;
        /* if(obj.value=="")
           {
           alert("Please enter"+text);
           //obj.focus();
           return false;
           }*/
        if(!RE1.test(obj))
        {
         return t('modules.Generic.errorMsg.numeric', {text:text})
        }
        if(eval(obj)<0 || eval(obj)>23)
        {
         return t('modules.Generic.errorMsg.shouldBeBetween', {text:text, start:0, end:23})
        }
        return null;
}


export function checkMinute(obj,text,t)
{
        var RE1 = /^\d+$/;
        // if(obj.value!="")
        // {
        if(!RE1.test(obj))
        {
         return t('modules.Generic.errorMsg.numeric', {text:text})
        }
        if(eval(obj)<0 || eval(obj)>59)
        {
         return t('modules.Generic.errorMsg.shouldBeBetween', {text:text, start:0, end:59})
        }
        // }
        return null;
}

export function BinaryUnicodeValidation(text,obj,t)
{
        var RE=/^[A-Fa-f0-9\s]+$/;

        if(!RE.test(obj.value))
        {
         return t('modules.Generic.errorMsg.validBinary', {text:text})
        }
        return null;

}

export function checkAllZeros(phno) {
   if (phno !== "") {
       for (let i = 0; i < phno.length; i++) {
           if (phno.charAt(i) !== "0") {
               break;
           }
           if (i === phno.length - 1) {
               return t('modules.Generic.errorMsg.containsOnlyZero');
           }
       }
   }
   return null;
}



export function checkNormalizationValue(no,text,ccInput,len,t) //MSISDN Normalization
{
        var multiCC= ccInput.split(",");
        var cc=multiCC[0];
        var RE  = /^[\+]?[0-9]+$/;
        var returnno="";
        if(no.length==0 || no=="")
        {
         return t('modules.Generic.errorMsg.mandatory', {text: text})

        }
        if(!RE.test(no))
        {
                return t('modules.Generic.errorMsg.invalidFrmt', {text: text})
        }
        else if(no.indexOf("+")>0)
        {
         return t('modules.Generic.errorMsg.invalidFrmtNum', {text: text,no:no})
        }
        else if(no.indexOf("00")==0 || no.indexOf("+")==0)
        {
                var chk=0;
                if(no.indexOf("+")==0)
                {
                        returnno=no.substring(1,no.length);
                }
                else
                {
                        returnno=no.substring(2,no.length);
                }
                var chk="0";
                for(var j=0;j<multiCC.length;j++)
                {
                        cc=multiCC[j];
                        //   alert('cc---'+cc);
                        if(returnno.indexOf(cc)==0)
                        {

                                var ccLength=parseInt(cc.length)+parseInt(len);
                                if((returnno.indexOf(cc)==0) && returnno.length==ccLength)
                                {
                                        no=returnno;
                                        chk=0;

                                }
                                else
                                {
                                        chk++;
                                }
                        }
                        else
                        {
                                no=returnno;
                        }
                }
                if(parseInt(chk)!=0)
                {
                  return t('modules.Generic.errorMsg.invalidFrmtLen', {text: text,len:len})
                }

        }
        else if(no.indexOf("0")==0)
        {
                returnno=no.substring(1,no.length);
                if(returnno.length==parseInt(len))
                {
                        no=cc+no.substring(1,no.length);//replace 0 with cc
                }
                else
                {
                     return t('modules.Generic.errorMsg.invalidFrmtNumLen', {text: text,no:no,len:len})
                }
        }
        else
        {
                if(no.length==parseInt(len))
                {
                        no=cc+no.substring(0,no.length);//no not starting with cc, add cc
                }
                else
                {
                  return t('modules.Generic.errorMsg.invalidFrmtNumLen', {text: text,no:no,len:len})
                }

        }
//                 alert(no);
return no;
}


export function checkNumericWithZero(objVal,min,max,text,t)
{
   var RE=/^[0-9]*$/;
   if(objVal == null || objVal =="")
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text})
   }
   if(!RE.test(objVal))
   {
      return t('modules.Generic.errorMsg.numeric', {text: text})
   }
   if(objVal.length < min || objVal.length > max)
   {
      return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
   }
   return null;
}


export function calLength(field,remLen,lang,maxlimit,keyP)
{
        var chkPlaceholders=field;
        //var k=20;        // stores the placeholders length

        var k=0;
        var actLen=0;
        var tmpLen=0;
        var newLen=0;
        var remValue=remLen.value;
        var data ="";
        var plexist=0;

        actLen=field.length;
        //var parcnt=chkPlaceholders.match(/__\$NAME__/g);
        var parcnt=chkPlaceholders.match(/_\$transid\$_/g);
        var cnt=0;

        if(parcnt!=null)
        {
            k=11;
                cnt=parcnt.length;
                /*tempLen= actLen-(cnt*9);
                newLen = tempLen+(cnt*k);*/

               tempLen= actLen-(cnt*11);
                newLen = tempLen+(cnt*k);

                plexist=1;
        }


         parcnt=chkPlaceholders.match(/_\$msisdn\$_/g);
        if(parcnt!=null)
        {
                k=10;
                cnt=parcnt.length;

                if(newLen!=0)
                        actLen=newLen;

                tempLen= actLen-(cnt*10);
                newLen = tempLen+(cnt*k);

                plexist=1;
        }



        parcnt=chkPlaceholders.match(/_\$pkgkey\$_/g);

        if(parcnt!=null)
        {
                k=10;
                cnt=parcnt.length;

                if(newLen!=0)
                        actLen=newLen;

                tempLen= actLen-(cnt*10);
                newLen = tempLen+(cnt*k);

                plexist=1;
        }



         parcnt=chkPlaceholders.match(/_\$pkgname\$_/g);

        if(parcnt!=null)
        {
                cnt=parcnt.length;
                k=11;

                if(newLen!=0)
                        actLen=newLen;

                tempLen= actLen-(cnt*11);
                newLen = tempLen+(cnt*k);

                plexist=1;
        }


        parcnt=chkPlaceholders.match(/_\$description\$_/g);

        if(parcnt!=null)
        {
                cnt=parcnt.length;
                k=15;

                if(newLen!=0)
                        actLen=newLen;

                tempLen= actLen-(cnt*15);
                newLen = tempLen+(cnt*k);

                plexist=1;
        }


      parcnt=chkPlaceholders.match(/_\$validity\$_/g);

        if(parcnt!=null)
        {
                cnt=parcnt.length;
                k=12;

                if(newLen!=0)
                        actLen=newLen;

                tempLen= actLen-(cnt*12);
                newLen = tempLen+(cnt*k);

                plexist=1;
        }



         parcnt=chkPlaceholders.match(/_\$expiry\$_/g);

        if(parcnt!=null)
        {
                cnt=parcnt.length;
                k=10;

                if(newLen!=0)
                        actLen=newLen;

                tempLen= actLen-(cnt*10);
                newLen = tempLen+(cnt*k);

                plexist=1;
        }



         parcnt=chkPlaceholders.match(/_\$amount\$_/g);

        if(parcnt!=null)
        {
                cnt=parcnt.length;
                k=10;

                if(newLen!=0)
                        actLen=newLen;

                tempLen= actLen-(cnt*10);
                newLen = tempLen+(cnt*k);

                plexist=1;
        }



        if(plexist==0)
        {
                newLen=chkPlaceholders.length;
        }

        return newLen;

}




// /*
export function alert(alertText)
{

swal({
    title : "",
    text : alertText,
    type: "warning",
    width:"450px",
    confirmButtonColor:'#ffb84d',
    allowEscapeKey: false,
    allowOutsideClick : false
  });

}

export function resetErrMsg(formId,elementId)
{
   var Doc=document.forms[formId];
   var errmsgId = "errmsg_"+elementId;
   $("#"+errmsgId).html("").show();
   eval("Doc."+elementId).style.borderColor = "";
}
/******************************************************************************************/
// isAlpha(event, formId, elementId) :  
/******************************************************************************************/

export function isAlpha(event,t)
{
   if((event.which > 20) && (event.which < 65 || event.which > 90) && (event.which < 97 || event.which > 122))
   {
      return t('modules.Generic.errorMsg.invalidChar')
   }
   return null;
}


export function chkAlpha(event, minLen, maxLen,mandatoryFlag, t)
{
   var RE=/^[a-zA-Z]*$/;
   

   if(mandatoryFlag != "0")   {

      if(event == null || event == "")
      {
         return t('modules.Generic.errorMsg.mandatory')
      }
   }
   if(event !="" ||event !=null){
      if(!RE.test(event))
      {
         return t('modules.Generic.errorMsg.onlyAlpha')
      }
      if(event.length < minLen || event.length > maxLen)
      {
         return t('modules.Generic.errorMsg.invalidLength')
      }
   }
   return null;
}


// /******************************************************************************************/
// // isNumeric(event, formId, elementId) :
// /******************************************************************************************/

export function isNumeric(event,t)
{
   if((event.which > 20) && (event.which < 48 || event.which > 57) && (event.which < 96 || event.which > 105))
   {
      return t('modules.Generic.errorMsg.onlyDigits')
   }
   
   return null;
}

export function chkNumeric( event, minLen, maxLen, mandatoryFlag, t)
{
   var RE=/^[0-9]*$/;

   if(mandatoryFlag != "0")   {
      if(event == null || event =="")
      {
         return t('modules.Generic.errorMsg.mandatory')
      }
   }
   if(event !="" ||event !=null){
      if(!RE.test(event))
      {
         return t('modules.Generic.errorMsg.onlyDigits')
      }
      if(event.length < minLen || event.length > maxLen)
      {
         return t('modules.Generic.errorMsg.minLenmaxLen',{minLen : minLen, maxLen:maxLen})
      }
   }
   return null;
}

// /******************************************************************************************/
// // isAlphaNumeric(event, formId, elementId) :
// /******************************************************************************************/

export function isAlphaNumeric(event)
{
   if(((event.which < 48 || event.which > 57) && (event.which < 96 || event.which > 105)) && (event.which < 65 || event.which > 90) && (event.which < 97 || event.which > 122))
   {
      return t('modules.Generic.errorMsg.onlyAlphaNum')
   }
   return null;
}

export function chkAlphaNumeric(event, minLen, maxLen , mandatoryFlag, t)
{
   var RE=/^[a-zA-Z0-9]*$/;

   if(mandatoryFlag != "0")   {
      if(event == null || event =="")
      {
         return t('modules.Generic.errorMsg.mandatory')
      }
   }
   if(event !="" ||event !=null){
      if(!RE.test(event))
      {
         return t('modules.Generic.errorMsg.onlyAlphaNum')
      }
      if(event.length < minLen || event.length > maxLen)
      {
         return t('modules.Generic.errorMsg.invalidLength')
      }
      const allZero = checkAllZeroes(event)
      if (allZero)
      {
         return allZero;
      }
   }
   return null;
}
// /******************************************************************************************/
// // isName(event, formId, elementId) :
// /******************************************************************************************/

export function isName(event,t)
{
   if((event.which > 20) && 
         (event.which < 65 || event.which > 90) && 
         (event.which != 46 && event.which != 95 && event.which != 32) && 
         (event.which < 97 || event.which > 122) && 
         (event.which < 48 || event.which > 57) && 
         (event.which < 96 || event.which > 105) )
   {
      return t('modules.Generic.errorMsg.invalidInput')
   }
   return null;
}

/*export function chkName(event, minLen, maxLen, mandatoryFlag, t)
{
   var RE= /^[a-zA-Z1-9]+[\_\.,a-zA-Z0-9\s-]*$/;

   if(event=="" ||event==null) {
      if(mandatoryFlag != "0") {
         return t('modules.Generic.errorMsg.mandatory')
      }
      return null;
   }
   if(event !="" ||event !=null){
      if(event.charAt(0)==0)
      {
         return t('modules.Generic.errorMsg.shldNotStartWithZero')
      }
      if(!RE.test(event))
      {
         return t('modules.Generic.errorMsg.alphaNumWithSpclCharNdSpace')
      }
      if(event.length < minLen || event.length > maxLen)
      {
         return t('modules.Generic.errorMsg.minLenmaxLen',{minLen : minLen, maxLen:maxLen})
      }
   }
   return null;
}
*/
export function chkName(event, minLen, maxLen, mandatoryFlag, t)
{
   var RE= /^[a-zA-Z1-9]+[\_\.,a-zA-Z0-9\s\-]*$/;
   var RE1 = /^[a-zA-Z1-9]/;
   if(event=="" ||event==null) {
      if(mandatoryFlag != "0") {
         return t('modules.Generic.errorMsg.mandatory')
      }
      return null;
   }
   if(event !="" ||event !=null){
      if(event.charAt(0)==0)
      {
         return t('modules.Generic.errorMsg.shldNotStartWithZero')
      }
      if(!RE1.test(event))
      {
         return t('modules.Generic.errorMsg.startWithAlphaNumeric')
      }
      if(!RE.test(event))
      {
         return t('modules.Generic.errorMsg.alphaNumWithSpclCharNdSpace')
      }
      if(event.length < minLen || event.length > maxLen)
      {
         return t('modules.Generic.errorMsg.minLenmaxLen',{minLen : minLen, maxLen:maxLen})
      }
   }
   return null;
}


// /******************************************************************************************/
// // isMail(event, formId, elementId) :
// /******************************************************************************************/

export function isMail(event, t)
{
   if((event.which > 20) && (((event.which < 48 || event.which > 57) && (event.which < 96 || event.which > 105)) && (event.which < 65 || event.which > 90)) && (event.which != 46 && event.which != 95 && event.which != 64) && (event.which < 97 || event.which > 122))
   {
      return t('modules.Generic.errorMsg.invalidInput')
   }
   return null;
}

export function chkMail(event,mandatoryFlag,t)
{
   if(mandatoryFlag != "0")   {
      if (null==event || "" == event) {
         return t('modules.Generic.errorMsg.mandatory')
      }
   }
   if(event !="" ||event !=null){

      var RE=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (0 == RE.test (event)) {
         return t('modules.Generic.errorMsg.invalid')
      }
   }
   return null;
}


// /******************************************************************************************/
// // chkMandatory(formId,elementId) :
// /******************************************************************************************/
export function chkMandatory(event) 
{
   if(event=="" ||event==null)
   {
      return t('modules.Generic.errorMsg.mandatory')
   }
   return null;
}

// /******************************************************************************************/
// // isMail(event, formId, elementId) :
// /******************************************************************************************/
export function chkMobileNum(numberInput, ccInput, len, mandatoryFlag, t) //MSISDN Normalization
{

   var multiCC= ccInput.split(",");
   var cc=multiCC[0];
   var RE  = /^[\+]?[0-9]+$/;
   var returnno="";

   if(mandatoryFlag != "0")   {
      if(numberInput.length==0 || numberInput=="")
      {
         return t('modules.Generic.errorMsg.mandatory')
      }
   }
   if(numberInput !="" ||numberInput !=null){
      if(!RE.test(numberInput))
      {                
         return t('modules.Generic.errorMsg.invalidFormat')
      }

      else if(numberInput.indexOf("+")>0)
      {
         return t('modules.Generic.errorMsg.onlyDigits')
      }
      else if(numberInput.indexOf("00")==0 || numberInput.indexOf("+")==0)
      {
         var chk=0;
         if(numberInput.indexOf("+")==0)
         {
            returnno=numberInput.substring(1,numberInput.length);
         }
         else
         {
            returnno=numberInput.substring(2,numberInput.length);
         }
         var chk="0";
         for(var j=0;j<multiCC.length;j++)
         {
            cc=multiCC[j];
            //   alert('cc---'+cc);
            if(returnno.indexOf(cc)==0)
            {

               var ccLength=parseInt(cc.length)+parseInt(len);
               if((returnno.indexOf(cc)==0) && returnno.length==ccLength)
               {
                  numberInput=returnno;
                  chk=0;

               }
               else
               {
                  chk++;
               }
            }
            else
            {
               numberInput=returnno;
            }
         }
         if(parseInt(chk)!=0)
         {
            return t('modules.Generic.errorMsg.invalidLength')
         }

      }
      else if(numberInput.indexOf("0")==0)
      {
         returnno=numberInput.substring(1,numberInput.length);
         if(returnno.length==parseInt(len))
         {
            numberInput=cc+numberInput.substring(1,numberInput.length);//replace 0 with cc
         }
         else
         {
            return t('modules.Generic.errorMsg.invalidLength')
         }
      }
      else
      {
         if(numberInput.length==parseInt(len))
         {
            numberInput=cc+numberInput.substring(0,numberInput.length);//no not starting with cc, add cc
         }
         else
         {
            return t('modules.Generic.errorMsg.invalidLength');
         }

      }
   }
   return null;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
export function chkDateWithTimeWithDateFormat(obj,text,errMsgId,DateFormat,t)
 {
//    var DateFormat=document.forms["AuditDetForm"].tssDateFormat.value;
    if(obj.value == "")
    {
      return t('modules.Generic.errorMsg.mandatory');
    }
    if(obj.value != "")
    {
    var fdate=obj.value;
    var dd="";
    var mm="";
    var yyyy="";
    var time="";
    var seldat="";

    if("yyyy"==DateFormat.substring(0,fdate.indexOf("/")))
    {
           yyyy=fdate.substring(0,fdate.indexOf("/"));
          if("MM"==DateFormat.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/")))
          {
              mm=fdate.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/"));
              dd=fdate.substring(fdate.lastIndexOf("/")+1,fdate.lastIndexOf(" "));
          }
          else
          {
              dd=fdate.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/"));
              mm=fdate.substring(fdate.lastIndexOf("/")+1,fdate.lastIndexOf(" "));
          }
    }

    else if("MM"==DateFormat.substring(0,fdate.indexOf("/")))
    {
           mm=fdate.substring(0,fdate.indexOf("/"));
          if("dd"==DateFormat.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/")))
          {
              dd=fdate.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/"));
              yyyy=fdate.substring(fdate.lastIndexOf("/")+1,fdate.lastIndexOf(" "));
          }
                   else
         {
             yyyy=fdate.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/"));
             dd=fdate.substring(fdate.lastIndexOf("/")+1,fdate.lastIndexOf(" "));
         }
   }

   else if("dd"==DateFormat.substring(0,fdate.indexOf("/")))
   {
          dd=fdate.substring(0,fdate.indexOf("/"));
         if("MM"==DateFormat.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/")))
         {
             mm=fdate.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/"));
             yyyy=fdate.substring(fdate.lastIndexOf("/")+1,fdate.lastIndexOf(" "));
         }
         else
         {
             yyyy=fdate.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/"));
             mm=fdate.substring(fdate.lastIndexOf("/")+1,fdate.lastIndexOf(" "));
         }
   }

   time=fdate.substring(fdate.lastIndexOf(" "),fdate.length);
//alert("FromDate: yyyy:"+yyyy+" mm:"+mm+" dd:"+dd+" time:"+time );

       var tempdat = new Date();
       var curdat = new Date(tempdat.getFullYear(),tempdat.getMonth(),tempdat.getDate());
       var seldat = new Date(yyyy,mm-1,dd);
//alert("seldat:"+seldat);
       if((seldat > curdat))
       {
          //alert(text+" should be less than or equals to  current date ");
          return t('modules.Generic.errorMsg.dateLessThan', {text:text});
       }
    }
    return null;
 }

///////////////////////////////////////////////////////////////////////////////////////////

export function chkDateWithDateFormat(obj,text,errMsgId,DateFormat,t)
 {
//    var DateFormat=document.forms["AuditDetForm"].tssDateFormat.value;
    if(obj.value == "")
    {
       //alert("Please select "+text);
       return t('modules.Generic.errorMsg.mandatory');
    }
    if(obj.value != "")
    {
    var fdate=obj.value;
    var dd="";
    var mm="";
    var yyyy="";
    var time="";
    var seldat="";

    if("yyyy"==DateFormat.substring(0,fdate.indexOf("/")))
    {
           yyyy=fdate.substring(0,fdate.indexOf("/"));
          if("MM"==DateFormat.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/")))
          {
              mm=fdate.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/"));
              dd=fdate.substring(fdate.lastIndexOf("/")+1,fdate.length);
          }
          else
          {
              dd=fdate.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/"));
              mm=fdate.substring(fdate.lastIndexOf("/")+1,fdate.length);
          }
    }

    else if("MM"==DateFormat.substring(0,fdate.indexOf("/")))
    {
           mm=fdate.substring(0,fdate.indexOf("/"));
          if("dd"==DateFormat.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/")))
          {
              dd=fdate.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/"));
              yyyy=fdate.substring(fdate.lastIndexOf("/")+1,fdate.length);
          }
                   else
         {
             yyyy=fdate.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/"));
             dd=fdate.substring(fdate.lastIndexOf("/")+1,fdate.length);
         }
   }

   else if("dd"==DateFormat.substring(0,fdate.indexOf("/")))
   {
          dd=fdate.substring(0,fdate.indexOf("/"));
         if("MM"==DateFormat.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/")))
         {
             mm=fdate.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/"));
             yyyy=fdate.substring(fdate.lastIndexOf("/")+1,fdate.length);
         }
         else
         {
             yyyy=fdate.substring(fdate.indexOf("/")+1,fdate.lastIndexOf("/"));
             mm=fdate.substring(fdate.lastIndexOf("/")+1,fdate.length);
         }
   }

//alert("FromDate: yyyy:"+yyyy+" mm:"+mm+" dd:"+dd );

       var tempdat = new Date();
       var curdat = new Date(tempdat.getFullYear(),tempdat.getMonth(),tempdat.getDate());
       var seldat = new Date(yyyy,mm-1,dd);
//alert("seldat:"+seldat);
       if((seldat > curdat))
       {
          //alert(text+" should be less than or equals to  current date ");
          return t('modules.Generic.errorMsg.dateLessThan', {text:text});
       }
    }
    return null;
 }
/////////////////////////////////////////////////////////////////////////////////////////////////////

export function validateDateWithTimeWithDateFormat(frmDt,frmDtText,toDt,toDtText1,errMsgId,DateFormat)
{
   var curDate = new Date();
   var from = frmDt.value;

   var yyyy="";
   var yyyy1="";
   var mm="";
   var mm1="";
   var dd="";
   var dd1="";

   if("yyyy"==DateFormat.substring(0,from.indexOf("/")))
    {
           yyyy=from.substring(0,from.indexOf("/"));
          if("MM"==DateFormat.substring(from.indexOf("/")+1,from.lastIndexOf("/")))
          {
              mm=from.substring(from.indexOf("/")+1,from.lastIndexOf("/"));
              dd=from.substring(from.lastIndexOf("/")+1,from.lastIndexOf(" "));
          }
          else
          {
              dd=from.substring(from.indexOf("/")+1,from.lastIndexOf("/"));
              mm=from.substring(from.lastIndexOf("/")+1,from.lastIndexOf(" "));
          }
    }

    else if("MM"==DateFormat.substring(0,from.indexOf("/")))
    {
           mm=from.substring(0,from.indexOf("/"));
          if("dd"==DateFormat.substring(from.indexOf("/")+1,from.lastIndexOf("/")))
          {
              dd=from.substring(from.indexOf("/")+1,from.lastIndexOf("/"));
              yyyy=from.substring(from.lastIndexOf("/")+1,from.lastIndexOf(" "));
          }
                   else
         {
             yyyy=from.substring(from.indexOf("/")+1,from.lastIndexOf("/"));
             dd=from.substring(from.lastIndexOf("/")+1,from.lastIndexOf(" "));
         }
   }

   else if("dd"==DateFormat.substring(0,from.indexOf("/")))
   {
          dd=from.substring(0,from.indexOf("/"));
         if("MM"==DateFormat.substring(from.indexOf("/")+1,from.lastIndexOf("/")))
         {
             mm=from.substring(from.indexOf("/")+1,from.lastIndexOf("/"));
             yyyy=from.substring(from.lastIndexOf("/")+1,from.lastIndexOf(" "));
         }
         else
         {
             yyyy=from.substring(from.indexOf("/")+1,from.lastIndexOf("/"));
             mm=from.substring(from.lastIndexOf("/")+1,from.lastIndexOf(" "));
         }
   }

   var hh=from.substring(from.indexOf(" ")+1,from.indexOf(":"));
   var min=from.substring(from.indexOf(":")+1,from.lastIndexOf(":"));
   var ss=from.substring(from.lastIndexOf(":")+1,from.length);

//alert("FromDate: yyyy:"+yyyy+" mm:"+mm+" dd:"+dd+" hh:"+hh+" min:"+min+" ss:"+ss);

   var toDate = toDt.value;

   if("yyyy"==DateFormat.substring(0,toDate.indexOf("/")))
    {
           yyyy1=toDate.substring(0,toDate.indexOf("/"));
          if("MM"==DateFormat.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/")))
          {
              mm1=toDate.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/"));
              dd1=toDate.substring(toDate.lastIndexOf("/")+1,toDate.lastIndexOf(" "));
          }
          else
          {
              dd1=toDate.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/"));
              mm1=toDate.substring(toDate.lastIndexOf("/")+1,toDate.lastIndexOf(" "));
          }
    }

    else if("MM"==DateFormat.substring(0,toDate.indexOf("/")))
    {
           mm1=toDate.substring(0,toDate.indexOf("/"));
          if("dd"==DateFormat.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/")))
          {
              dd1=toDate.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/"));
              yyyy1=toDate.substring(toDate.lastIndexOf("/")+1,toDate.lastIndexOf(" "));
          }
                   else
         {
             yyyy1=toDate.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/"));
             dd1=toDate.substring(toDate.lastIndexOf("/")+1,toDate.lastIndexOf(" "));
         }
   }

   else if("dd"==DateFormat.substring(0,toDate.indexOf("/")))
   {
          dd1=toDate.substring(0,toDate.indexOf("/"));
         if("MM"==DateFormat.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/")))
         {
             mm1=toDate.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/"));
             yyyy1=toDate.substring(toDate.lastIndexOf("/")+1,toDate.lastIndexOf(" "));
         }
         else
         {
             yyyy1=toDate.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/"));
             mm1=toDate.substring(toDate.lastIndexOf("/")+1,toDate.lastIndexOf(" "));
         }
   }

   var hh1=toDate.substring(toDate.indexOf(" ")+1,toDate.indexOf(":"));
   var min1=toDate.substring(toDate.indexOf(":")+1,toDate.lastIndexOf(":"));
   var ss1=toDate.substring(toDate.lastIndexOf(":")+1,toDate.length);

//alert("FromDate: yyyy:"+yyyy1+" mm:"+mm1+" dd:"+dd1+" hh:"+hh1+" min:"+min1+" ss:"+ss1);

   var fromdat = new Date(yyyy,mm-1,dd,hh,min,ss);
   var todat = new Date(yyyy1,mm1-1,dd1,hh1,min1,ss1);

//alert(fromdat);
//alert(todat);

   if(todat < fromdat)
   {
      //alert(toDtText1+" should be greater than "+frmDtText);
      return t('modules.Generic.errorMsg.dateLessThan', {toDt:toDtText1, fromDt:frmDtText});
   }
   return null;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////


export function validateDateWithDateFormat(frmDt,frmDtText,toDt,toDtText1,errMsgId,DateFormat,t)
{
   var curDate = new Date();
   var from = frmDt.value;

   var yyyy="";
   var yyyy1="";
   var mm="";
   var mm1="";
   var dd="";
   var dd1="";

   if("yyyy"==DateFormat.substring(0,from.indexOf("/")))
    {
           yyyy=from.substring(0,from.indexOf("/"));
          if("MM"==DateFormat.substring(from.indexOf("/")+1,from.lastIndexOf("/")))
          {
              mm=from.substring(from.indexOf("/")+1,from.lastIndexOf("/"));
              dd=from.substring(from.lastIndexOf("/")+1,from.length);
          }
          else
          {
              dd=from.substring(from.indexOf("/")+1,from.lastIndexOf("/"));
              mm=from.substring(from.lastIndexOf("/")+1,from.length);
          }
    }

    else if("MM"==DateFormat.substring(0,from.indexOf("/")))
    {
           mm=from.substring(0,from.indexOf("/"));
          if("dd"==DateFormat.substring(from.indexOf("/")+1,from.lastIndexOf("/")))
          {
              dd=from.substring(from.indexOf("/")+1,from.lastIndexOf("/"));
              yyyy=from.substring(from.lastIndexOf("/")+1,from.length);
          }
                   else
         {
             yyyy=from.substring(from.indexOf("/")+1,from.lastIndexOf("/"));
             dd=from.substring(from.lastIndexOf("/")+1,from.length);
         }
   }

   else if("dd"==DateFormat.substring(0,from.indexOf("/")))
   {
          dd=from.substring(0,from.indexOf("/"));
         if("MM"==DateFormat.substring(from.indexOf("/")+1,from.lastIndexOf("/")))
         {
             mm=from.substring(from.indexOf("/")+1,from.lastIndexOf("/"));
             yyyy=from.substring(from.lastIndexOf("/")+1,from.length);
         }
         else
         {
             yyyy=from.substring(from.indexOf("/")+1,from.lastIndexOf("/"));
             mm=from.substring(from.lastIndexOf("/")+1,from.length);
         }
   }

//alert("FromDate: yyyy:"+yyyy+" mm:"+mm+" dd:"+dd);

   var toDate = toDt.value;

   if("yyyy"==DateFormat.substring(0,toDate.indexOf("/")))
    {
           yyyy1=toDate.substring(0,toDate.indexOf("/"));
          if("MM"==DateFormat.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/")))
          {
              mm1=toDate.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/"));
              dd1=toDate.substring(toDate.lastIndexOf("/")+1,toDate.length);
          }
          else
          {
              dd1=toDate.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/"));
              mm1=toDate.substring(toDate.lastIndexOf("/")+1,toDate.length);
          }
    }

    else if("MM"==DateFormat.substring(0,toDate.indexOf("/")))
    {
           mm1=toDate.substring(0,toDate.indexOf("/"));
          if("dd"==DateFormat.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/")))
          {
              dd1=toDate.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/"));
              yyyy1=toDate.substring(toDate.lastIndexOf("/")+1,toDate.length);
          }
                   else
         {
             yyyy1=toDate.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/"));
             dd1=toDate.substring(toDate.lastIndexOf("/")+1,toDate.length);
         }
   }

   else if("dd"==DateFormat.substring(0,toDate.indexOf("/")))
   {
          dd1=toDate.substring(0,toDate.indexOf("/"));
         if("MM"==DateFormat.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/")))
         {
             mm1=toDate.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/"));
             yyyy1=toDate.substring(toDate.lastIndexOf("/")+1,toDate.length);
         }
         else
         {
             yyyy1=toDate.substring(toDate.indexOf("/")+1,toDate.lastIndexOf("/"));
             mm1=toDate.substring(toDate.lastIndexOf("/")+1,toDate.length);
         }
   }

//alert("FromDate: yyyy:"+yyyy1+" mm:"+mm1+" dd:"+dd1);

   var fromdat = new Date(yyyy,mm-1,dd);
   var todat = new Date(yyyy1,mm1-1,dd1);

//alert(fromdat);
//alert(todat);

   if(todat < fromdat)
   {
      //alert(toDtText1+" should be greater than "+frmDtText);
      return t('modules.Generic.errorMsg.dateLessThan', {toDt:toDtText1, fromDt:frmDtText});
   }
   return null;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
export function emailVal( email) 
{

   if (null==email || "" == email) {
    return null
   }

   var RE=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   if (0 == RE.test (email)) {
      return t('modules.Generic.errorMsg.invalid');
   }
   return null
}

////////////////////////////////////////////////////////////////////////////////////
export function mobileNumValidation(numberInput,ccInput,len) //MSISDN Normalization
{
   var multiCC= ccInput.split(",");
   var cc=multiCC[0];
   var RE  = /^[\+]?[0-9]+$/;
   var returnno="";

   if(numberInput.length==0 || numberInput=="")
   {
      return t('modules.Generic.errorMsg.mandatory');
   }
   if(!RE.test(numberInput))
   {
      return t('modules.Generic.errorMsg.invalidFormat');
   }
   else if(numberInput.indexOf("+")>0)
   {
      return t('modules.Generic.errorMsg.unsupportedChar');
   }
   else if(numberInput.indexOf("00")==0 || numberInput.indexOf("+")==0)
   {
      var chk=0;
      if(no.indexOf("+")==0)
      {
         returnno=numberInput.substring(1,numberInput.length);
      }
      else
      {
         returnno=numberInput.substring(2,numberInput.length);
      }
      var chk="0";
      for(var j=0;j<multiCC.length;j++)
      {
         cc=multiCC[j];
         //   alert('cc---'+cc);
         if(returnno.indexOf(cc)==0)
         {

            var ccLength=parseInt(cc.length)+parseInt(len);
            if((returnno.indexOf(cc)==0) && returnno.length==ccLength)
            {
               numberInput=returnno;
               chk=0;

            }
            else
            {
               chk++;
            }
         }
         else
         {
            numberInput=returnno;
         }
      }
      if(parseInt(chk)!=0)
      {
         return t('modules.Generic.errorMsg.invalidLength');
      }

   }
   else if(numberInput.indexOf("0")==0)
   {
      returnno=numberInput.substring(1,no.length);
      if(returnno.length==parseInt(len))
      {
         numberInput=cc+numberInput.substring(1,no.length);//replace 0 with cc
      }
      else
      {
         return t('modules.Generic.errorMsg.invalidLength');
      }
   }
   else
   {
      if(numberInput.length==parseInt(len))
      {
         numberInput=cc+numberInput.substring(0,numberInput.length);//no not starting with cc, add cc
      }
      else
      {
         return t('modules.Generic.errorMsg.invalidLength');
      }

   }
   return numberInput;
}
//////////////////////////////////////////////////////////////////////////////////////

export function chkDisplay(event, mandatoryFlag)
{
  
   var RE= /^[a-zA-Z0-9]*$/;

   if(mandatoryFlag != "0")   {
      if(event=="" ||event==null)
      {
         return t('modules.Generic.errorMsg.mandatory');
      }
   }
   if(event !="" ||event !=null){
      if(!RE.test(event.charAt(0)))
      {
         return t('modules.Generic.errorMsg.chkDiplayCodition');
      }
   }
   return null;
}
///////////////////////////////////////////////////////////////////////////////////
export function fNameDupChk(page,data,id,name,errmsgId,fieldId,flag,errMsg)
{
  var result = null;
   $.ajax({
      url: page,
      data: data,
      cache: false,
      async: false,
      success: function(contents)
      {
        contents = contents.trim();
        //alert("TBR  --> "  + contents+"    Id : "+id);
        var nameArr = [];
        if(contents != "")
          nameArr = contents.split(",");

        if(nameArr != null && nameArr.length > 0)
        {
          for (var i=0; i<nameArr.length; i+=2)
          {
            if(flag =="ADD")
            {
              if(nameArr[i+1].trim().toUpperCase() == name.trim().toUpperCase())
              {
               return t('modules.Generic.errorMsg.alreadyExist');
              }
            }
            else if(flag == "MOD")
            {
              if((nameArr[i+1].trim().toUpperCase() == name.trim().toUpperCase()) && id != nameArr[i])
              {
               return t('modules.Generic.errorMsg.alreadyExist');
              }
            }
          }
        }
      } ,
      error: function(contents)
      {
         alert("Error, Please reload the page");
      }
   });
  return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////
export function checkAlphaName(event,min,max,text,t)
{
  var RE  = /^[a-zA-Z0-9\_\-]+$/;
  var RE1 =/^[a-zA-Z]+$/;
   if(event== "" || event==null)
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text})
   }
   if(!RE.test(event))
   {
      return t('modules.Generic.errorMsg.alphaUndscr', {text: text})
   }
   if(event.length < min || event.length > max)
   {
      return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
   }
        if(!RE1.test(event.charAt(0)))
      {
         return t('modules.Generic.errorMsg.notStartWithNum',{text:text});
      }

   return null;
}
///////////////////////////////////////////////////////////////////////////////////////////

export function checkNumVal(event,min,max,text,t)
{
      var RE = /^\d+$/;
      var eventValue = parseInt(event, 10);
      if(event == "")
      {
         return t('modules.Generic.errorMsg.mandatory', {text: text})
      }

      if(!RE.test(eventValue))
      {
         return t('modules.Generic.errorMsg.numeric', {text: text})
      }

      // if(eventValue!=0)
      // {
      //   if((eventValue.charAt(0) == 0))
      //   {
      //    return t('modules.Generic.errorMsg.validNumWithoutZeroInitially', {text: text})
      //   }
      // }
      
      if(eventValue <= min || eventValue >= max)
      {
         return t('modules.Generic.errorMsg.valueBetween', {min:min , max:max, text:text});
      }
      return null;
}



export function checkNum(event,min,max,text,t)
{
   var RE = /^\d+$/;
      var eventValue = parseInt(event, 10);
      if(event == "")
      {
         return t('modules.Generic.errorMsg.mandatory', {text: text})
      }

      if(!RE.test(event))
      {
         return t('modules.Generic.errorMsg.numeric', {text: text})
      }
      
      if(event.length < min || event.length > max)
      {
         return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
      }
      return null;
}



//------------------------------------------------
export function numericValidationforValueandLength(objVal,min,max,text,textMinVal,textMaxVal,t)
{
   var RE=/^[0-9]*$/;
   if(objVal === null || objVal === "")
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text})

   }
   if(!RE.test(objVal))
   {
      return t('modules.Generic.errorMsg.numeric', {text: text});
   }
   if(objVal.length < min || objVal.length > max)
   {
      return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text});
   }
   if(objVal < textMinVal ||  objVal > textMaxVal)
   {
      return  t('modules.Generic.errorMsg.greaterOrLessThan', {textMinVal:textMinVal , textMaxVal:textMaxVal, text:text});
   }
   return null;
}
//----------------------------------------------------
export function alphaNumericwithonlyspace(objVal,min,max,text,t)
{
   var RE=/^[a-zA-Z0-9][a-zA-Z0-9\s]+$/;
   if(objVal == null || objVal =="")
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text})
   }
   if(!RE.test(objVal))
   {
      return t('modules.Generic.errorMsg.alphanumwithonlyspace', {text: text})
   }
   if(objVal.length < min || objVal.length > max)
   {
      return  t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
   }
   return null;
}
//------------------------------------------------------------------

export function alphaNumericWithSpaceAndUnderscore(objVal,min,max,text,t)
{
   var RE= /^[A-Za-z0-9_ ]*$/;

   if(objVal == null || objVal =="")
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text})
   }
   if(!RE.test(objVal))
   {
      return t('modules.Generic.errorMsg.alphanumwithspaceunderscore', {text: text})
   }
   if(objVal.length < min || objVal.length > max)
   {
      return  t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
   }
   return null;
}

//---------------------------------------------
export function alphaNumericwithSpecificLengthforAplhaNum(objVal, minNum, maxNum, minAlphaNum, maxAlphaNum, text, t) {
  const regex = new RegExp(`^(?:\\d{${minNum},${maxNum}}|[\\w\\s-]{${minAlphaNum},${maxAlphaNum}})$`);

  if (objVal == null || objVal === "") {
    return t('modules.Generic.errorMsg.mandatory', { text: text });
  }

  if (!regex.test(objVal)) {
    return t('modules.Generic.errorMsg.alphaNumericwithSpecificLengthforAplhaNum', { text: text, minNum: minNum, maxNum: maxNum, minAlphaNum: minAlphaNum, maxAlphaNum: maxAlphaNum });
  }

  return null;
}

//------------------------------------------------------------------------------------
export function alphaNumericwithspace(objVal, min, max, text, t) {
 
    var RE = /^[a-zA-Z0-9\s]*$/;
 
    if (objVal == null || objVal === "") {
       return t('modules.Generic.errorMsg.mandatory', { text: text });
    }
 
    if (!RE.test(objVal)) {
       return t('modules.Generic.errorMsg.alphanumwithonlyspace', { text: text });
    }
 
    if (objVal.length < min || objVal.length > max) {
       return t('modules.Generic.errorMsg.valWithMinMaxLen', { min: min, max: max, text: text });
    }
 
    return null;
 }

//--------------------------------------------------USSD Validation------------------------------
export function hostNameValidation(objVal,min,max,text,t)
{
   var RE=/^[a-zA-Z0-9_\.]+$/;
   if(objVal == null || objVal =="")
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text})
   }
   if(!RE.test(objVal))
   {
      return t('modules.Generic.errorMsg.hostNameValidation', {text: text})
   }
   if(objVal.length < min || objVal.length > max)
   {
      return  t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
   }
   return null;
}

export function timeFormatValidation(objVal, text, t) {
   // Regular expression for allowed characters
   var RE = /^[a-zA-Z0-9\s\-\%\:\/]+$/;

   // Check for mandatory value
   if (objVal == null || objVal === "") {
       return t('modules.Generic.errorMsg.mandatory', { text: text });
   }

   // Check if the value matches the allowed characters pattern
   if (!RE.test(objVal)) {
       return t('modules.Generic.errorMsg.TimeFormatValidation', { text: text });
   }

   // Return null if all checks pass
   return null;
}

//--------------------------------------------------------------------------------
export function checkNumWithZero(objVal,min,max,text,t)
{
   var RE=/^[0-9]*$/;
   if(objVal == null || objVal =="")
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text})
   }
   if(!RE.test(objVal))
   {
      return t('modules.Generic.errorMsg.numeric', {text: text})
   }

   var numVal = Number(objVal);

    // Check if the number is within the valid range
    if (numVal < 0 || numVal > 32767) {
        return t('modules.Generic.errorMsg.valWithMinMax', { min: 0, max: 32767, text: text });
    }
    
   if(objVal.length < min || objVal.length > max)
   {
      return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
   }
   
   return null;
}
//------------------------------------------------------------------------------------

export function alphaNumericValidationWithoutMandatory(objVal,min,max,text,t,opt)
{
   var RE=/^[a-zA-Z0-9]*$/;
   if(opt == 1)
   {   
   if(objVal === null || objVal ==="")
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text})
   }  
   }
   if(objVal.length>0){
   if(objVal.length < min || objVal.length > max)
      {
         return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
      }

      const err = checkAllZeroes(objVal,t)
   {
      if(err)
            return err; 
   }

   if(!RE.test(objVal))
      {
         return t('modules.Generic.errorMsg.alphaNum', {text: text})
      }

   }
   
   return null;
}
//--------------------------------------------------------------------------

export function checkAlphaUnderscoreWithoutMandatory(value, min, max, text, t, opt) {
   const RE = /^[a-zA-Z0-9\_]+$/;

   // If the option is 1, perform length and mandatory checks
   if (opt === 1) {
       if (value === null || value === "") {
           return `Please enter ${text}`;
       }
      }
       // Only check length if the value is not empty
       if (value.length > 0) {
           if (value.length < min || value.length > max) {
               return t('modules.Generic.errorMsg.checkAlphaUnderscorelength', { min: min, max: max, text: text });
           }

           if (!RE.test(value)) {
            return t('modules.Generic.errorMsg.checkAlphaUnderscorealphanumeral', { text: text });
        }
       }
   

  

   return null;
}

//-------------------------------------------------------------------------------
export function alphaNumericWithAllSpecial(objVal, min, max, text, t, opt) {
   var RE = /^[a-zA-Z0-9\s\-\_\.\~\`\!\@\#\$\%\^\&\*\(\)\=\+\}\{\]\[\|\\\"\'\;\:\?\/\>\.\<\,]*$/;
   
   if (opt === 1) {
       if (objVal === null || objVal === "") {
           return t('modules.Generic.errorMsg.mandatory', { text: text });
       } 
   }

   if (objVal.length > 0) { // Only check length if objVal is not empty
      if (objVal.length < min || objVal.length > max) {
          return t('modules.Generic.errorMsg.valWithMinMaxLen', { min: min, max: max, text: text });
      }

      if (!RE.test(objVal)) {
         return t('modules.Generic.errorMsg.alphaNumericWithAllSpecial', { text: text });
     }
  }

  

   return null;
}
//--------------------------------------------------------------------------------------------------
export function checkLastWeekdate(objVal,text,t){
   if(objVal == null || objVal =="")
      {
         return t('modules.Generic.errorMsg.mandatory', {text: text});
      }

   return null;
}

export function checkPasswordValidation(password,oldPassword,complexity,minLen,maxLen,t) {
  if(password == null ||password == '') {
      return t('modules.Generic.errorMsg.mandatory');
  }
  if (/^\s|\s$/.test(password)) {  
      return t("modules.Generic.errorMsg.noSpacesAllowed");
   }  

   if(password == oldPassword) {
      return t('modules.Generic.errorMsg.sameAsOldPassword');
   }
 
   if(password.length < minLen) {
    return t('modules.Generic.errorMsg.minPasswordError', { min: minLen});
   }
 
   if(password.length > maxLen) {
      return t('modules.Generic.errorMsg.maxPasswordError', { max: maxLen});
    }

   var PW1 = /[A-Z]/;
   if (((1 == complexity) || (3 == complexity) || (5 == complexity) || (7 == complexity) || (9 == complexity) || (11 == complexity) || (13 == complexity) || (15 == complexity))
&& (0 == PW1.test (password))) {
      return t('modules.Generic.errorMsg.atleastOneCapitalLetter');
   }
    
   var PW2 = /[0-9]/;
if (((2 == complexity) || (3 == complexity) || (6 == complexity) || (7 == complexity) || (10 == complexity) || (11 == complexity) || (14 == complexity) || (15 ==complexity))
&& (0 == PW2.test (password))) {
       return t('modules.Generic.errorMsg.atleastOneNumber');
   }
  
   var PW3 = /[\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]/;
if (((4 == complexity) || (5 == complexity) || (6==complexity) || (7 == complexity) || (12 == complexity) || (13 == complexity) || (14 == complexity) || (15 == complexity) )
&& (0 == PW3.test (password))) {
       return t('modules.Generic.errorMsg.atleastOneSpecialChar');
   }

   var PW4 = /[a-z]/;
if (((8 == complexity) || (9 == complexity) || (10 == complexity) || (11 == complexity) || (12 == complexity) || (13 == complexity) || (14 == complexity) || (15 == complexity))
&& (0 == PW4.test (password))) {
      return t('modules.Generic.errorMsg.atleastOneSmallLetter');
   }
  
   return null;
} 




export function allcharactersvalidation(objVal,min,max,text,t)
{
   if(objVal == null || objVal =="")
   {
      return t('modules.Generic.errorMsg.mandatory', {text: text})
   }
 
  if (objVal.startsWith(" ")) {
    return `${text} should not start with space`;
  }
 
 
   if(objVal.length < min || objVal.length > max)
   {
      //return  t('snd.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
       return t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text});
   }
   return null;
}

 
// -------------------------------------------
 export function chkMandatoryWithLen(event,min,max,text,t)
 {
    if(event=="" ||event==null)
    {
       return t('modules.Generic.errorMsg.mandatory')
    }

    if(event.length < min || event.length > max)
    {
       return  t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
    }

    return null;
 }


 export function hostNameValidate(objVal,min,max,text,t)
 {
     var RE=/^[a-zA-Z0-9]+[\*\.\s\_\-a-zA-Z0-9]*$/;
    if(objVal == null || objVal =="")
    {
       return t('modules.Generic.errorMsg.mandatory', {text: text})
    }
    if(!RE.test(objVal))
    {
       return t('modules.Generic.errorMsg.hostNameValidate', {text: text})
    }
    if(objVal.length < min || objVal.length > max)
    {
       return  t('modules.Generic.errorMsg.valWithMinMaxLen', {min:min , max:max, text:text})
    }
    return null;
 }



 export function ipAddressValidate(hostIpAddr, text, t) {
   if (!hostIpAddr || hostIpAddr.trim() === "") {
     return t('modules.Generic.errorMsg.mandatory', { text });
   }

   let hostIpAddrVal = "";
   let hostMaskVal = null;

   if (hostIpAddr.includes("/")) {
     const [ip, mask] = hostIpAddr.split("/");
     hostIpAddrVal = ip.trim();
     hostMaskVal = mask.trim();
   } else {
     hostIpAddrVal = hostIpAddr.trim();
   }

   const alphaErr = alphaNumWithAllSpecial(hostIpAddrVal, 1, 20, "IP Address", t, 0);
   if (alphaErr) {
     return alphaErr;
   }

   const ipRegex =
     /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

   if (!ipRegex.test(hostIpAddrVal)) {
     return t('modules.Generic.errorMsg.invalidIpAddress', { text });
   }

   if (hostMaskVal) {
     const maskErr = numValueValidation(hostMaskVal, 1, 255, 0, text, t);
     if (maskErr) {
       return maskErr;
     }
   }

   return null;
}
 
