(function(){const t=document.createElement("template");t.innerHTML='\n<!-- Style Definition -->\n<style>\n.datebox {\ndisplay: inline-block;\nwidth: 100px;\npadding: 8px;\ntext-align: center;\nvertical-align: middle;\nborder: 1px solid black;\n}\n\n.day {\nfont-size: 40px;\nfont-weight: bold;\n}\n\n.date {\nfont-size: 20px;\n}\n</style>\n\n<!-- Layout Definition -->\n<div class="datebox">\n<div class="day"></div>\n<div class="date"></div>\n</div>',customElements.define("picker-date",class extends HTMLElement{constructor(){super().append(t.content.cloneNode(!0));const e=["zo","ma","di","wo","do","vr","za"],n=["jan","feb","mrt","apr","mei","juni","juli","aug","sep","okt","nov","dec"];this.$week=0,this.$date=0,this.$month=0,this.$dateValid=!1,this.$months=n,this.$_day=this.querySelector(".day"),this.$_datebox=this.querySelector(".datebox"),this.$_day.innerHTML=this.id?e[parseInt(this.id)]:"ERROR",this.render(),this.parentNode.addEventListener("changeWeek",t=>{this.$week+=t.detail.change,this.$week<0&&(this.$week=0),this.render()}),this.$_datebox.addEventListener("click",()=>{if(this.$dateValid){const t=new CustomEvent("datepicked",{composed:!0,detail:{date:this.$date,month:this.$month}});this.dispatchEvent(t)}})}render(){const t=new Date,e=parseInt(this.id);this.$dateValid=0!==e&&6!==e&&!(0===parseInt(this.$week)&&t.getDay()>parseInt(this.id)),this.$_datebox.style.color=this.$dateValid?"#000000":"#CCCCCC",t.setDate(t.getDate()+7*this.$week+(parseInt(this.id)-t.getDay())),this.$date=t.getDate(),this.$month=t.getMonth(),this.querySelector(".date").innerHTML=`${this.$date} ${this.$months[this.$month]}`}})})();