'use strict';
const Grow = dt=>{
   var SpecialRun=v.SpecialRun,Special8Eff
   ,AutoPool=v.AutoPool,AutoActive=v.AutoActive
   ,a1,a2,a3,n,n1;
   for(n1=AutoActive.length,n=0;n<n1;++n) AutoPool[AutoActive[n]].act();
   if(v.AlphaSeries&16) v.FGHNumber=Plus(v.FGHNumber,Times(v.BalumEff,dt));
   n1=v.BM0etc.length;
   if(SpecialRun&252){
      if(SpecialRun&8) v.Special8Eff=Math.min((Date.now()-Time.LastBought)/60000,1);
      if(SpecialRun&16) v.Special16Eff=Power(v.Special16Base,Date.now()-Time.LastBought);
      if(SpecialRun&32) v.Special32Eff=Power(v.Special32Base,Date.now()-Time.LastBM0etcUnlock);
      Special8Eff=v.Special8Eff;
      if(SpecialRun&244)
         while(n1--){
            n=(a1=v.BM0etc[n1]).length;
            a2=v.BM0etcMult[n1];
            a3=v.BM0etcDivider[n1];
            while(--n) a1[n-1]=Plus(a1[n-1],Times(Divide(Power(Times(a1[n],a2[n]),SpecialRun&8?Special8Eff:1),a3[n]),dt*0.2))
         }
      else
         while(n1--){
            n=(a1=v.BM0etc[n1]).length;
            a2=v.BM0etcMult[n1];
            while(--n) a1[n-1]=Plus(a1[n-1],Times(Power(Times(a1[n],a2[n]),SpecialRun&8?Special8Eff:1),dt*0.2))
         }
   }else
      while(n1--){
         n=(a1=v.BM0etc[n1]).length;
         a2=v.BM0etcMult[n1];
         while(--n) a1[n-1]=Plus(a1[n-1],Times(Times(a1[n],a2[n]),dt*0.2))
      }
   Vue.set(v.BM0etc,0,v.BM0etc[0]);
   v.MainNumber=Plus(v.MainNumber,Times(v.Growth,dt));
}
,TimeRaw = ()=>({
   LastUpdate:Date.now()
   ,LastGame:Date.now()
   ,LastFGHPrestige:Date.now()
   ,LastBought:Date.now()
   ,LastBM0etcUnlock:Date.now()
})
,InitialData = ()=>({
   ExportBox:false
   ,ExportContent:''
   ,UpdateInterval:62
   ,AutoSave:10000
   ,NumberBase:10
   ,Precision:4
   ,Hotkey:1
   ,CurrentTab:3
   ,Achievement:[0]
   ,Ach2r16:[0,0]
   ,MainNumber:4
   ,MainNumberEver:4
   ,BMSStage:0
   ,BM0etc:[[0,0,0]]
   ,BM0etcBought:[[0,0,0]]
   ,BM0etcLength:[3]
   ,BM0etcLengthEver:[3]
   ,BM0etcUnlockTotal:0
   ,BM0c1:2
   ,SpecialRun:0 //auto max all:2, auto unlock:16, auto (0)(1)[n]:8, auto FGH-prestige:32, inside:128, outside:64, sides:1, start with:4
   ,Special4Eff:[[]]
   ,Special8Eff:1
   ,Special16Eff:1
   ,Special32Eff:1
   ,Special16Base:1
   ,Special32Base:1
   ,FGHNumber:0
   ,FGHPrestige:0
   ,FGHPrestigeFastest:Infinity
   ,FGHNumberRate:0
   ,FGHTab:0
   ,AlphaSeries:0 //1 bit for every item
   ,FGH0:[0]
   ,FGH1:[0]
   ,FGH2iter1:0
   ,FGH2:[]
   ,FGH3:2
   ,FGHSpecial:0 //1 bit for every item
   ,AutoActive:[]
})
,vPre = InitialData()
,show = x=>Show(x,vPre.Precision,vPre.NumberBase)
,showInt = x=>Show(x,vPre.Precision,vPre.NumberBase,true);
Vue.filter('show',show);
Vue.filter('showInt',showInt);
const v = new Vue({
   el:'#game'
   ,data:vPre
   ,computed:{
      Growth(){
         var BM0etc=this.BM0etc,BM0etcMult=this.BM0etcMult
         ,SpecialRun=this.SpecialRun,Special8Eff=this.Special8Eff,BM0etcDivider=this.BM0etcDivider
         ,n=BM0etc.length,s;
         s=SpecialRun&252?
            Times(BM0etc[0][0],Divide(Power(BM0etcMult[0][0],SpecialRun&8?Special8Eff:1),SpecialRun&244?BM0etcDivider[0][0]:1))||0
            :Times(BM0etc[0][0],BM0etcMult[0][0])||0;
         if(SpecialRun&252)
            while(--n) s=Times(s,Plus(Times(BM0etc[n][0],Divide(Power(BM0etcMult[n][0],SpecialRun&8?Special8Eff:1),SpecialRun&244?BM0etcDivider[n][0]:1))||0,1));
         else
            while(--n) s=Times(s,Plus(Times(BM0etc[n][0],BM0etcMult[n][0])||0,1));
         return s
      }
      ,AchievementName:GetAchievementName
      ,AchievementTooltip:GetAchievementTooltip
      ,AchieveSingle(){
         var Achievement=this.Achievement,x,y=9,arr,arr1=[];
         while(y--){
            arr=[];
            for(x=9;x--;) arr[x]=Achievement[y]>>x&1;
            arr1[y]=arr
         }
         return arr1
      }
      ,AchieveCell(){
         var Achievement=this.Achievement,x,y,x1,y1=3,tmp,arr=[];
         for(x=9;x--;) arr[x]=[];
         while(y1--){
            for(x1=3;x1--;){
               tmp=((Achievement[3*y1]&Achievement[3*y1+1]&Achievement[3*y1+2])>>3*x1&7)==7;
               for(y=3;y--;)
                  for(x=3;x--;) arr[3*y1+y][3*x1+x]=tmp
            }
         }
         return arr
      }
      ,AchieveRow(){return this.Achievement.map(x=>(x&511)==511)}
      ,AchieveColumn(){
         var Achievement=this.Achievement,x=9,y,tmp,arr=[];
         while(x--){
            tmp=1;
            for(y=9;y--;) tmp&=Achievement[y]>>x&1;
            arr[x]=tmp
         }
         return arr
      }
      ,AchieveCellN(){
         var AchieveCell=this.AchieveCell,x,y=3,s=0;
         while(y--)
            for(x=3;x--;) s+=AchieveCell[3*y][3*x];
         return s
      }
      ,AchieveRowN(){return this.AchieveRow.reduce((x,y)=>x+y,0)}
      ,AchieveColumnN(){return this.AchieveColumn.reduce((x,y)=>x+y)}
      ,AchieveCellEff(){return Math.pow(1.3333333333333333,this.AchieveCellN)}
      ,BM0etcInfo(){
         var SpecialRun=this.SpecialRun,b16,n,n1=this.BM0etcLengthEver.length,arr,arr1=[];
         while(n1--){
            arr=[];
            for(n=this.BM0etcLengthEver[n1];n--;){
               b16=Power(n1+2,Power(2,Plus(Plus(n1,2),n)));
               arr[n]={
                  text:((n1,n)=>()=>'(0)'.repeat(n)+'['+showInt(n1)+']')(n1+2,n+1+n1)
                  ,tooltip:n?'Generate '+'(0)'.repeat(n+n1)+'['+showInt(n1+2)+']':'Make your number grow'
                  ,costo:SpecialRun&1&&n?['BM0etc',n1,n-1]:['MainNumber']
                  ,cost:(b16=>x=>Natural(Power(b16,Plus(x,0.5))))(b16)
                  ,sum:((b16,sumk)=>x=>Natural(Times(sumk,Plus(Power(b16,x),-1))))(b16,Divide(Power(n1+2,Power(2,Plus(Plus(n1,1),n))),Plus(b16,-1)))
                  ,solve:((b16,solvek)=>Y=>Log(b16,Plus(Times(solvek,Y),1)))(b16,Divide(Plus(b16,-1),Power(n1+2,Power(2,Plus(Plus(n1,1),n)))))
               }
            }
            arr1[n1]=arr
         }
         return arr1
      }
      ,BM0etcMult_Ach(){
         var Achievement=this.Achievement,BM0etcLengthEver=this.BM0etcLengthEver,n,n1=BM0etcLengthEver.length,arr,arr1=[]
         ,Overall=this.AchieveCellEff*(Achievement[1]&8?1.01:1)//Overall bonus to all (0)...(0)[x]
         ,BaseMult;
         while(n1--){
            switch(n1){//Bonus to (0)...(0)[n1+2] for certain base number
               case 0:
               BaseMult=(Achievement[0]&64?1.02:1)*(Achievement[0]&128?1.05:1)*(Achievement[0]&256?1.1:1)*(Achievement[1]&256?1.7:1);
               break;
               case 1:
               BaseMult=(Achievement[2]&4?1.02:1)*(Achievement[2]&8?1.05:1)*(Achievement[2]&16?1.1:1);
               break;
               default:
               BaseMult=1
            }
            arr=[];
            n=BM0etcLengthEver[n1];
            while(n--) arr[n]=Times(Overall,BaseMult);
            arr1[n1]=arr
         }
         //Single BM specific bonus
         if(Achievement[0]&8) arr1[0][0]=Times(arr1[0][0],1.05);
         if(arr1[0][1]&&Achievement[1]&128) arr1[0][1]=Times(arr1[0][1],1.1);
         if(arr1[0][2]&&Achievement[0]&16) arr1[0][2]=Times(arr1[0][2],1.05);
         if(arr1[0][3]&&Achievement[1]&16) arr1[0][3]=Times(arr1[0][3],1.05);
         if(arr1[0][6]&&Achievement[1]&64) arr1[0][6]=Times(arr1[0][6],1.2);
         if(arr1[1]&&Achievement[2]&32){
            if(arr1[1][0]) arr1[1][0]=Times(arr1[1][0],1.2);
            if(arr1[1][1]) arr1[1][1]=Times(arr1[1][1],1.2)
         }
         return arr1
      }
      ,BM0etcMult_Bought(){
         var BM0etcBought=this.BM0etcBought,bought
         ,n,n1=BM0etcBought.length,arr,arr1=[]
         ,Base3Incr=2+(this.Achievement[2]&64?0.1:0);
         while(n1--){
            arr=[];
            n=(bought=BM0etcBought[n1]).length;
            while(n--) arr[n]=bought[n]?Power(n1==1?Base3Incr:n1+2,Plus(bought[n],-1)):1;
            arr1[n1]=arr
         }
         return arr1
      }
      ,BM0etcMult_Unlocker(){
         var BM0etcLength=this.BM0etcLength,BM0etcLengthStart=this.BM0etcLengthStart,BM0etcUnlockerEff=this.BM0etcUnlockerEff
         ,FGH00Eff=this.AlphaSeries&1?this.FGH00Eff:1
         ,top,unlockereff
         ,n,n1=BM0etcLength.length,arr,arr1=[];
         while(n1--){
            top=(n=BM0etcLength[n1])-BM0etcLengthStart[n1];
            unlockereff=BM0etcUnlockerEff[n1];
            arr=[];
            while(n--) arr[n]=Times(Power(unlockereff,Max(top-n,0)),FGH00Eff);
            arr1[n1]=arr
         }
         return arr1
      }
      ,BM0etcMult_NumEver(){
         var FGH0=this.FGH0,FGH0Eff=this.FGH0Eff,BM0etcLengthEver=this.BM0etcLengthEver
         ,n,n1=BM0etcLengthEver.length,arr,arr1=[];
         while(n1--){
            arr=[];
            n=BM0etcLengthEver[n1];
            while(--n>=(FGH0[n1]||0)) arr[n]=1;
            for(;n>=0;--n) arr[n]=FGH0Eff;
            arr1[n1]=arr
         }
         return arr1
      }
      ,BM0etcMult_FGHPres(){
         var FGH1=this.FGH1,FGH1Eff=this.FGH1Eff,BM0etcLengthEver=this.BM0etcLengthEver
         ,Overall=this.AlphaSeries&2?this.FGHbase1Eff:1
         ,n,n1=BM0etcLengthEver.length,arr,arr1=[];
         while(n1--){
            arr=[];
            n=BM0etcLengthEver[n1];
            while(--n>=(FGH1[n1]||0)) arr[n]=Overall;
            for(;n>=0;--n) arr[n]=Times(Overall,FGH1Eff);
            arr1[n1]=arr
         }
         return arr1
      }
      ,BM0etcMult(){
         var Ach=this.BM0etcMult_Ach,Bought=this.BM0etcMult_Bought,Unlocker=this.BM0etcMult_Unlocker
         ,NumEver=this.BM0etcMult_NumEver,FGHPres=this.BM0etcMult_FGHPres
         ,ach,bought,unlocker,fghpres,numever
         ,n,n1=Bought.length,arr,arr1=[];
         while(n1--){
            arr=[];
            ach=Ach[n1];
            n=(bought=Bought[n1]).length;
            unlocker=Unlocker[n1];
            numever=NumEver[n1];
            fghpres=FGHPres[n1];
            while(n--) arr[n]=Times(Times(Times(ach[n],bought[n]),unlocker[n]),Times(numever[n],fghpres[n]));
            arr1[n1]=arr
         }
         if(this.AlphaSeries&4) arr1[0][0]=Times(arr1[0][0],this.ZeralumEff);
         return arr1
      }
      ,BM0etcDivider(){
         var BM0etc=this.BM0etc,SpecialRun=this.SpecialRun,Special4Eff=this.Special4Eff,Special16Eff=this.Special16Eff,Special32Eff=this.Special32Eff
         ,n,n1=BM0etc.length,i1,arr,arr1=[];
         if(!(SpecialRun&252)) return;
         while(n1--){
            arr=[];
            n=BM0etc[n1].length;
            while(n--){
               arr[n]=SpecialRun&64?Plus(BM0etc[n1][n+1]||0,1):1;
               if(SpecialRun&128) for(i1=BM0etc.length;i1--;) i1===n1||(arr[n]=Times(arr[n],Plus(BM0etc[i1][n-i1+n1]||0,1)));
               if(SpecialRun&4) arr[n]=Times(arr[n],Special4Eff[n1]&&Special4Eff[n1][n]||1);
               if(SpecialRun&16) arr[n]=Times(arr[n],Special16Eff);
               if(SpecialRun&32) arr[n]=Times(arr[n],Special32Eff)
            }
            arr1[n1]=arr
         }
         return arr1
      }
      ,BM0etcModifierHtml(){
         var SpecialRun=this.SpecialRun,Special8Eff=this.Special8Eff,BM0etcDivider=this.BM0etcDivider,n,n1=BM0etcDivider.length,arr,arr1=[];
         if(!(SpecialRun&252)) return;
         while(n1--){
            arr=[];
            n=BM0etcDivider[n1].length;
            while(n--) arr[n]=(SpecialRun&8?'^'+show(Special8Eff):'')+(SpecialRun&244?'/'+show(BM0etcDivider[n1][n]):'')
            arr1[n1]=arr
         }
         return arr1
      }
      ,BM0etcLengthStart(){
         var FGH2=this.FGH2,n=Math.max(this.BM0etcLengthEver.length,FGH2.length),arr=[];
         if(this.FGHSpecial&128)
            while(n--) arr[n]=2;
         else
            while(n--) arr[n]=1+(FGH2[n]||2);
         return arr
      }
      ,BM0etcUnlockText(){return this.BM0etcLength.map((x,n)=>'(0)'.repeat(x+n)+'['+showInt(n+2)+']')}
      ,BM0etcUnlockText1(){return this.BM0etcLengthEver.map((x,n)=>n?'and base-'+showInt(n+1)+' unlocker ':'')}
      ,BM0etcUnlockTooltip(){return this.BM0etcLengthEver.map((x,n)=>'Reset your number'+(n?', all zero-only BM and previous unlockers':' and all zero-only BM'))}
      ,BM0etcUnlockCost(){
         var FGH3=this.FGH3,n=Math.max(this.BM0etcLengthEver.length,FGH3-1),arr=[];
         while(n--) arr[n]=n+(n&&n+2<=FGH3?1:2);
         return arr
      }
      ,BM0etcCantUnlock(){
         var BM0etcUnlockCost=this.BM0etcUnlockCost,BM0etcLength=this.BM0etcLength;
         return this.BM0etc.map((x,n)=>LessQ(x[BM0etcLength[n]-1]||0,BM0etcUnlockCost[n]))
      }
      ,BM0etcUnlockerEff(){
         var BM0etcLength=this.BM0etcLength,BM0etcLengthStart=this.BM0etcLengthStart,n=BM0etcLength.length-1,arr=[]
         ,Overall=this.Achievement[2]&256?1.02:1;
         arr[n]=Overall;
         while(n--) arr[n]=Times(Plus(Times(Minus(BM0etcLength[n+1],BM0etcLengthStart[n+1]),arr[n+1]),1),Overall);
         return arr.map(x=>Power(2,x))
      }
      ,BM0etcUnlockEverText(){return this.BM0etcLengthEver.map((x,n)=>'(0)'.repeat(x+n)+'['+showInt(n+2)+']')}
      ,BM0c1Cost(){
         var BM0c1=this.BM0c1;
         return Natural(Power(BM0c1,Power(2,Plus(Times(BM0c1,BM0c1),2))))
      }
      ,BM0c1Cant(){return LessQ(this.MainNumber,this.BM0c1Cost)}
      ,FGHPrestigeCant(){return LessQ(this.MainNumber,this.SpecialRun&255?1e160:1e100)}
      ,FGHNumberToGet(){
         if(this.FGHPrestigeCant) return 0;
         var x=Ln(this.MainNumber);
         return Times(Floor(Plus(Exp(Times(x,Power(Ln(x),-3.25))),-1.5522390492173715)),this.FGH2iter1Eff)
      }
      ,FGH00Cant(){return this.AlphaSeries&1||LessQ(this.FGHNumber,1)}
      ,FGHbase1Cant(){return this.AlphaSeries&2||LessQ(this.FGHNumber,2)}
      ,ZeralumCant(){return this.AlphaSeries&4||LessQ(this.FGHNumber,11)}
      ,UnalumPre(){return !this.FGH0[8]||LessQ(this.FGH0[8],9)}
      ,UnalumCant(){return this.UnalumPre||this.AlphaSeries&8||LessQ(this.FGHNumber,20)}
      ,BalumPre(){return !this.FGH1[8]||LessQ(this.FGH1[8],9)}
      ,BalumCant(){return this.BalumPre||this.AlphaSeries&16||LessQ(this.FGHNumber,10240)}
      ,FGH00Eff(){return Power(Max(this.BM0etcUnlockTotal,1),0.3)}
      ,FGHbase1Eff(){return Power(Max(this.FGHPrestige,1),0.5)}
      ,ZeralumEff(){
         var x=Plus(Times(this.FGHNumber,0.25),1);
         return Times(x,x)
      }
      ,BalumEff(){return Times(0.1,this.FGHNumberRate)}
      ,FGH0Html(){return this.FGH0.map((x,n)=>'f<sub>0</sub>'+(x?'<sup>'+showInt(Plus(x,1))+'</sup>':'')+'('+showInt(n+2)+')')}
      ,FGH0Text(){return this.FGH0.map((x,n)=>LessQ(Plus(x,n),16)?'(0)'.repeat(Plus(x,n+1))+'['+showInt(n+2)+']':'(0)...(0)['+showInt(n+2)+'] with '+showInt(Plus(x,n+1))+" (0)'s")}
      ,FGH0Cost(){return this.FGH0.map((x,n)=>Natural(Plus(x,n+3)))}
      ,FGH0Cant(){
         var FGHNumber=this.FGHNumber;
         return this.FGH0Cost.map(x=>LessQ(FGHNumber,x))
      }
      ,FGH0Eff(){return Log(1e100,this.MainNumberEver)}
      ,FGH1Html(){return this.FGH1.map((x,n)=>'f<sub>1</sub>'+(x?'<sup>'+showInt(Plus(x,1))+'</sup>':'')+'('+showInt(n+2)+')')}
      ,FGH1Text(){return this.FGH1.map((x,n)=>LessQ(Plus(x,n),16)?'(0)'.repeat(Plus(x,n+1))+'['+showInt(n+2)+']':'(0)...(0)['+showInt(n+2)+'] with '+showInt(Plus(x,n+1))+" (0)'s")}
      ,FGH1Cost(){return this.FGH1.map((x,n)=>Natural(Times(n+2,Power(2,Plus(x,1)))))}
      ,FGH1Cant(){
         var FGHNumber=this.FGHNumber;
         return this.FGH1Cost.map(x=>LessQ(FGHNumber,x))
      }
      ,FGH1Eff(){return Math.min(1+256*Math.pow(this.FGHPrestigeFastest,-0.75),2048)}
      ,FGH2iter1Text(){return showInt(Plus(this.FGH2iter1,2))}
      ,FGH2iter1Cost(){
         var n=Plus(this.FGH2iter1,2);
         return Natural(Times(n,Power(2,n)))
      }
      ,FGH2iter1Cant(){return LessQ(this.FGHNumber,this.FGH2iter1Cost)}
      ,FGH2iter1Eff(){return Power(1.1,this.FGH2iter1)}
      ,FGH2Html(){return this.FGH2.map((x,n)=>'f<sub>2</sub><sup>'+showInt(n+2)+'</sup>('+showInt(x)+')')}
      ,FGH2Text(){return this.FGH2.map((x,n)=>'(0)'.repeat(Plus(x,n+2))+'['+showInt(n+2)+']')}
      ,FGH2Cost(){return this.FGH2.map((x,n)=>Natural(IteratedFGH2(x,n+2)))}
      ,FGH2Cant(){
         var FGHNumber=this.FGHNumber;
         return this.FGH2Cost.map(x=>LessQ(FGHNumber,x))
      }
      ,FGH3Cost(){return Natural(IteratedFGH2(this.FGH3,this.FGH3))}
      ,FGH3Cant(){return LessQ(this.FGHNumber,this.FGH3Cost)}
      ,FGHSpecialText1(){return 'Reach '+show(1e160)+' to get automatic buy max of all zero-only BM'}
      ,FGHSpecialText2(){return 'Reach '+show(1e160)+' to get automatic unlock zero-only BM'}
      ,FGHSpecialText3(){return 'Reach '+show(1e160)+' to get (0)(1)[n] autobuyer'}
      ,FGHSpecialText4(){return 'Reach '+show(1e160)+' to get automatic FGH-prestige'}
      ,FGHSpecialText5(){return 'Reach '+show(1e160)+' to unlock FGH-inside items'}
      ,FGHSpecialText6(){return 'Reach '+show(1e160)+' to unlock FGH-outside items'}
      ,FGHSpecialText7(){return 'Reach '+show(1e160)+' to unlock FGH-sides items'}
      ,FGHSpecialText8(){return 'Reach '+show(1e160)+', then you start with only 2 BM available for every base number'}
      ,AutoPool:()=>[null
         ,{text:'Automatic max all zero-only BM',act:()=>v.BM0etcMaxall()}
         ,{text:'Automatic unlock zero-only BM',act:()=>{
            var n=v.BM0etcLengthEver.length;
            while(n--) if(v.BM0etcCantUnlock[n]===false) v.BM0etcUnlock(n)
         }}
         ,{text:'Automatic buy (0)(1)[n]', act:()=>v.BM0c1Cant||v.BM0c1Buy()}
         ,{text:'Automatic FGH-prestige',act:()=>v.FGHPrestigeCant||v.FGHPrestigeDo()}
         ,{text:'Automatic buy max (0)[2]',act:()=>v.BM0etc[0]&&v.BM0etc[0].length&&BuyMax(['BM0etc',0,0],['BM0etcBought',0,0],['MainNumber'],v.BM0etcInfo[0][0].sum,v.BM0etcInfo[0][0].solve)}
         ,{text:'Automatic unlock (0)...(0)[2]',act:()=>v.BM0etcCantUnlock[0]===false&&v.BM0etcUnlock(0)}
         ,{text:'Automatic buy max (0)(0)[3]',act:()=>v.BM0etc[1]&&v.BM0etc[1].length&&BuyMax(['BM0etc',1,0],['BM0etcBought',1,0],['MainNumber'],v.BM0etcInfo[1][0].sum,v.BM0etcInfo[1][0].solve)}
         ,{text:'Automatic buy max (0)...(0)[2]',act:()=>{
            var amount=v.BM0etc[0],n,info;
            if(!amount) return;
            n=amount.length;
            info=v.BM0etcInfo[0]
            while(n--) BuyMax(['BM0etc',0,n],['BM0etcBought',0,n],['MainNumber'],info[n].sum,info[n].solve)
         }}
      ]
      ,AutoAvailable(){
         var AchieveRowN=this.AchieveRowN,FGHSpecial=this.FGHSpecial,arr=[];
         if(FGHSpecial&1) arr.push(1);
         if(FGHSpecial&2) arr.push(2);
         if(FGHSpecial&4) arr.push(3);
         if(FGHSpecial&8) arr.push(4);
         if(AchieveRowN>=1) arr.push(5);
         if(AchieveRowN>=2) arr.push(6);
         if(AchieveRowN>=3) arr.push(7);
         if(AchieveRowN>=4) arr.push(8);
         return arr
      }
   }
   ,methods:{
      Save:n=>Save(n)
      ,Load:n=>Load(n)
      ,Export:()=>{
         Save(0);
         v.ExportContent=localStorage.getItem('0').split('').map(x=>String.fromCharCode(174+(x.charCodeAt(0)>>8),174+(x.charCodeAt(0)&255))).join('');
         v.ExportBox=true
      }
      ,Import:()=>{
         var arr=v.ExportContent.split(''),i;
         for(i=0;i<arr.length;++i) arr.splice(i,2,String.fromCharCode((arr[i].charCodeAt(0)-174<<8)+arr[i+1].charCodeAt(0)-174));
         localStorage.setItem('0',arr.join(''));
         v.ExportBox=false;
         Load(0)
      }
      ,Reset:()=>{
         if(!confirm('Unlike other resets, you will lose all the progress WITHOUT ANY BONUS OR REWARD.\nDo you really want a FULL reset?')) return;
         AchievementOff();
         var init=InitialData();
         Object.getOwnPropertyNames(init).map(x=>v[x]=init[x]);
         Time=TimeRaw();
         AchievementOn();
         Save(0)
      }
      ,GamePlayed:()=>show((Date.now()-Time.LastGame)*0.001)
      ,FGHPrestigePlayed:()=>show((Date.now()-Time.LastFGHPrestige)*0.001)
      ,BM0etcBuying:(n1,n,delta)=>{
         var SpecialRun=v.SpecialRun,BM0etcBought=v.BM0etcBought,BM0etcInfo,Special4Eff
         ,amount,bought,b16,excess,i,i1;
         if(SpecialRun&2){
            v.MainNumber=4;
            amount=v.BM0etc[n1];
            bought=BM0etcBought[n1];
            for(i=n;i--;){
               amount[i]=0;
               bought[i]=0
            }
            Vue.set(amount,0,amount[0]);
            Vue.set(bought,0,bought[0])
         }
         if(SpecialRun&4){
            bought=Minus(BM0etcBought[n1][n],delta);
            b16=Power(n1+2,Power(2,Plus(Plus(n1,2),n)));
            BM0etcInfo=v.BM0etcInfo;
            Special4Eff=v.Special4Eff;
            for(i1=BM0etcBought.length;i1--;){
               if(!Special4Eff[i1]) Special4Eff[i1]=[];
               for(i=BM0etcBought[i1].length;i--;){
                  if(i1===n1&&i===n) continue;
                  excess=Min(Natural(Minus(Log(b16,BM0etcInfo[i1][i].cost(BM0etcBought[i1][i])),bought)),delta);
                  if(Sign(excess)>0) Special4Eff[i1][i]=Times(Special4Eff[i1][i]||1,Power(2,excess))
               }
            }
            Vue.set(Special4Eff,0,Special4Eff[0])
         }
         if(SpecialRun&24){
            if(SpecialRun&16) v.Special16Base=Exp(Divide(10,LessQ(delta,1.01)?16+Date.now()-Time.LastBought:16));
            Time.LastBought=Date.now();
         }
      }
      ,BM0etcMaxall:()=>{
         var BM0etc=v.BM0etc,BM0etcInfo=v.BM0etcInfo,n,n1=BM0etc.length
         ,SpecialRun=v.SpecialRun,BM0etcBought,delta;
         if(SpecialRun&31){
            if(SpecialRun&2){
               BM0etcBought=v.BM0etcBought;
               while(n1--)
                  for(n=BM0etc[n1].length;n--;)
                     if(LessEqualQ(BM0etcInfo[n1][n].cost(BM0etcBought[n1][n]),SpecialRun&1&&n?BM0etc[n1][n-1]:v.MainNumber)){
                        Vue.set(BM0etc[n1],n,Plus(BM0etc[n1][n],1));
                        Vue.set(BM0etcBought[n1],n,Plus(BM0etcBought[n1][n],1));
                        v.BM0etcBuying(n1,n,1)
                     }
               return
            }
            while(n1--)
               for(n=BM0etc[n1].length;n--;){
                  delta=BuyMax(['BM0etc',n1,n],['BM0etcBought',n1,n],SpecialRun&1&&n?['BM0etc',n1,n-1]:['MainNumber'],BM0etcInfo[n1][n].sum,BM0etcInfo[n1][n].solve);
                  delta&&SpecialRun&30&&v.BM0etcBuying(n1,n,delta)
               }
            return
         }
         while(n1--)
            for(n=BM0etc[n1].length;n--;)
               BuyMax(['BM0etc',n1,n],['BM0etcBought',n1,n],['MainNumber'],BM0etcInfo[n1][n].sum,BM0etcInfo[n1][n].solve)
      }
      ,BM0etcUnlock:n1=>{
         var BM0etcLength=v.BM0etcLength;
         Vue.set(BM0etcLength,n1,BM0etcLength[n1]+1);
         if(v.BM0etcLengthEver[n1]<BM0etcLength[n1]) Vue.set(v.BM0etcLengthEver,n1,BM0etcLength[n1]);
         if(!(v.Achievement[2]&16)&&n1<2) Vue.set(v.Ach2r16,n1,v.Ach2r16[n1]+1);
         ++v.BM0etcUnlockTotal;
         BM0etcReset(n1)
      }
      ,BM0c1Buy:()=>{
         var n=(++v.BM0c1)-2;
         if(v.BM0etcLengthEver.length<=n) Vue.set(v.BM0etcLengthEver,n,v.BM0etcLengthStart[n]||3);
         BM0etcReset(n+1)
      }
      ,FGHPrestigeDo:()=>{
         var t=(Date.now()-Time.LastFGHPrestige)*0.001;
         Time.LastFGHPrestige=Date.now();
         v.FGHNumber=Plus(v.FGHNumber,v.FGHNumberToGet);
         v.FGHPrestige++;
         v.FGHPrestigeFastest=Min(v.FGHPrestigeFastest,t);
         v.FGHNumberRate=Max(v.FGHNumberRate,Divide(v.FGHNumberToGet,t));
         if(v.SpecialRun&255){
            switch(v.SpecialRun&255){
               case 2: v.FGHSpecial|=1; break;
               case 16: v.FGHSpecial|=2; break;
               case 8: v.FGHSpecial|=4; break;
               case 32: v.FGHSpecial|=8; break;
               case 128: v.FGHSpecial|=16; break;
               case 64: v.FGHSpecial|=32; break;
               case 1: v.FGHSpecial|=64; break;
               case 4:
               v.FGH2.map((x,n)=>v.FGH2Discard(n));
               v.FGHSpecial|=128;
               break;
            }
            v.FGHSpecialExit()
         }
         BMSReset()
      }
      ,AlphaSeriesBuy:n=>{
         v.FGHNumber=Minus(v.FGHNumber,[1,2,11,20,10240][n]);
         v.AlphaSeries|=1<<n
      }
      ,FGH0Buy:n=>{
         var FGH0=v.FGH0;
         v.FGHNumber=Minus(v.FGHNumber,v.FGH0Cost[n]);
         Vue.set(FGH0,n,Plus(FGH0[n],1));
         if(n+1==FGH0.length) Vue.set(FGH0,n+1,0)
      }
      ,FGH0Buymax:n=>{
         Buymax(['FGH0',n],['FGHNumber'],x=>Natural(Times(Plus(n+2.5,Times(x,0.5)),x)),Y=>Plus(Power(Plus(Plus(Y,Y),(n+2.5)*(n+2.5)),0.5),-n-2.5));
         if(n+1==v.FGH0.length) Vue.set(v.FGH0,n+1,0)
      }
      ,FGH1Buy:n=>{
         var FGH1=v.FGH1;
         v.FGHNumber=Minus(v.FGHNumber,v.FGH1Cost[n]);
         Vue.set(FGH1,n,Plus(FGH1[n],1));
         if(n+1==FGH1.length) Vue.set(FGH1,n+1,0)
      }
      ,FGH1Buymax:n=>{
         Buymax(['FGH1',n],['FGHNumber'],x=>Natural(Times(n+2,Plus(Power(2,Plus(x,1)),-2))),Y=>Plus(Log(2,Plus(Divide(Y,n+2),2)),-1));
         if(n+1==v.FGH0.length) Vue.set(v.FGH0,n+1,0)
      }
      ,FGH2iter1Buy:()=>{
         v.FGHNumber=Minus(v.FGHNumber,v.FGH2iter1Cost);
         v.FGH2iter1=Plus(v.FGH2iter1,1)
      }
      ,FGH2iter1Buymax:()=>Buymax(['FGH2iter1'],['FGHNumber'],x=>Natural(Times(x,Power(2,Plus(x,2)))),Y=>Times(LambertW(Times(Y,0.17328679513998633)),1.4426950408889634))
      ,FGH2Buy:n=>{
         var FGH2=v.FGH2;
         v.FGHNumber=Minus(v.FGHNumber,v.FGH2Cost[n]);
         v.FGHSpecial&=~128;
         Vue.set(FGH2,n,Plus(FGH2[n],1))
      }
      ,FGH2Discard:n=>Vue.set(v.FGH2,n,2)
      ,FGH3Buy:()=>{
         v.FGHNumber=Minus(v.FGHNumber,v.FGH3Cost);
         v.FGH3=Plus(v.FGH3,1)
      }
      ,FGHSpecialEnter:n=>{
         Time.LastFGHPrestige=Date.now();
         BMSReset();
         v.SpecialRun|=[2,16,8,32,128,64,1,4][n-1]
      }
      ,FGHSpecialExit:()=>{
         if(v.SpecialRun&4) v.Special4Eff=[[]];
         if(v.SpecialRun&16) v.Special16Base=1;
         if(v.SpecialRun&32) v.Special32Base=1;
         v.SpecialRun&=~255
      }
   }
})
,BMSReset = ()=>{
   v.Ach2r16=[0,0];
   v.MainNumber=4;
   v.BMSStage=0;
   v.BM0etc=[[0]];
   v.BM0etcBought=[[0]];
   v.BM0etcLength=[v.BM0etcLengthStart[0]];
   v.BM0c1=2
}
,BM0etcReset = n=>{
   var BM0etcLength=v.BM0etcLength,BM0etcLengthStart=v.BM0etcLengthStart
   ,SpecialRun=v.SpecialRun;
   if(SpecialRun&36){
      if(SpecialRun&32){
         v.Special32Base=Root(Times(v.MainNumber,0.25),Date.now()-Time.LastBM0etcUnlock);
         Time.LastBM0etcUnlock=Date.now()
      }
      if(SpecialRun&4) v.Special4Eff=[[]];
   }
   while(n--) BM0etcLength[n]=BM0etcLengthStart[n];
   Vue.set(BM0etcLength,0,BM0etcLength[0]);
   v.MainNumber=4;
   v.BM0etc=[[0]];
   v.BM0etcBought=[[0]]
}
,Buymax = (Amount,Costo,sum,solve)=>{
   const amount=Pointer(v,Amount),costo=Pointer(v,Costo);
   var delta=Floor(Minus(solve(Plus(costo[0][costo[1]],sum(amount[0][amount[1]]))),amount[0][amount[1]]));
   if(Sign(delta)<0) delta=0;
   if(costo[0]===v){
      v[costo[1]]=Minus(v[costo[1]],Minus(sum(Plus(amount[0][amount[1]],delta)),sum(amount[0][amount[1]])));
      if(Sign(v[costo[1]])<0) v[costo[1]]=0;
   }else{
      Vue.set(costo[0],costo[1],Minus(costo[0][costo[1]],Minus(sum(Plus(amount[0][amount[1]],delta)),sum(amount[0][amount[1]]))))
      if(Sign(costo[0][costo[1]])<0) Vue.set(costo[0],costo[1],0);
   }
   Vue.set(amount[0],amount[1],Plus(amount[0][amount[1]],delta));
   return delta
}
,BuyMax = (Amount,Bought,Costo,sum,solve)=>{
   const amount=Pointer(v,Amount),bought=Pointer(v,Bought),costo=Pointer(v,Costo);
   var delta=Floor(Minus(solve(Plus(costo[0][costo[1]],sum(bought[0][bought[1]]))),bought[0][bought[1]]));
   if(Sign(delta)<0) delta=0;
   if(costo[0]===v){
      v[costo[1]]=Minus(v[costo[1]],Minus(sum(Plus(bought[0][bought[1]],delta)),sum(bought[0][bought[1]])));
      if(Sign(v[costo[1]])<0) v[costo[1]]=0;
   }else{
      Vue.set(costo[0],costo[1],Minus(costo[0][costo[1]],Minus(sum(Plus(bought[0][bought[1]],delta)),sum(bought[0][bought[1]]))))
      if(Sign(costo[0][costo[1]])<0) Vue.set(costo[0],costo[1],0);
   }
   Vue.set(amount[0],amount[1],Plus(amount[0][amount[1]],delta));
   Vue.set(bought[0],bought[1],Plus(bought[0][bought[1]],delta));
   return delta
}
,Loop = ()=>{
   setTimeout(Loop,v.UpdateInterval);
   var dt=(Date.now()-Time.LastUpdate)*0.001;
   Time.LastUpdate=Date.now();
   Grow(dt);
   if(v.AutoSave&&Time.LastUpdate-LastSave>=v.AutoSave){
      LastSave=Time.LastUpdate;
      Save(0)
   }
};
var LastSave=Date.now()
,Time=TimeRaw();
v.$watch('NumberBase',x=>{
   var pmax=29.9336062089226/Math.log(x);
   if(pmax<v.Precision) v.Precision=Math.floor(pmax)
});
v.$watch('MainNumber',x=>{
   var amount=v.BM0etc,bought=v.BM0etcBought,lens=v.BM0etcLength,n,n1=amount.length,m=lens.length;
   if(LessQ(v.MainNumberEver,x)) v.MainNumberEver=x;
   if(v.BMSStage<2){
      if(LessEqualQ(18446744073709551616,x)) v.BMSStage=2;
      else if(v.BMSStage<1&&LessEqualQ(16777216,x)) v.BMSStage=1;
   }
   while(LessQ(x,Power(--m+2,Power(2,m+1))));
   while(n1<=m){
      Vue.set(amount,n1,[]);
      Vue.set(bought,n1,[]);
      ++n1
   }
   while(n1--){
      amount=v.BM0etc[n1];
      bought=v.BM0etcBought[n1];
      lens=v.BM0etcLength[n1];
      while((n=amount.length)<lens&&LessEqualQ(Power(n1+2,Power(2,Plus(Plus(n1,1),n))),x)){
         Vue.set(amount,n,0);
         Vue.set(bought,n,0)
      }
   }
});
v.$watch('FGHNumber',x=>{
   var FGH2=v.FGH2,n=(x.pt||0)+1;
   while(LessQ(x,IteratedFGH2(2,--n+2))&&n>=0);
   for(;n>=FGH2.length&&n>=0;--n) Vue.set(FGH2,n,2);
});
window.addEventListener('keydown',e=>{
   if(!v.Hotkey||e.ctrlKey||e.altKey||e.shiftKey||e.metaKey) return;
   var k=e.keyCode;
   if(k>=96&&k<=105) k-=48;
   if(k>=50&&k<=57){
      if(v.BM0etcCantUnlock[k-50]===false) v.BM0etcUnlock(k-50);
      return
   }
   switch(k){
      case 48: return v.BM0etcMaxall();
      case 49: return v.BM0c1Cant||v.BM0c1Buy();
      case 80: return v.FGHPrestigeCant||v.FGHPrestigeDo();
   }
});
//Initialization
Load(0);
{
   let DeltaT=(Date.now()-Time.LastUpdate)*0.001;
   Time.LastUpdate=Date.now();
   let n=Math.ceil(Math.sqrt(DeltaT*3))
   ,dt=DeltaT/n;
   while(n--) Grow(dt);
}
Save(0);
document.getElementById('game').style.minHeight=(window.innerHeight-7)+'px';
document.body.removeChild(document.getElementById('loading'));
Loop()