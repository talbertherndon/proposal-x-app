import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import logo from '../../assets/icon.png'


export async function generatePdf(data, areas, parsed) {
  function generateHTML(areas) {
    let areasHTML = areas.map(area => {
      let requirements = typeof area.requirements === 'string' ? JSON.parse(area.requirements) : area.requirements;
      let reqHTML = requirements.map((req) => {
        return `<span style="font-size: 12px"><b>${req.name}</b> with ${req.coat} coats. ${req.comment ? req.comment : ''} </span>`
      }).join('');

      return `
        <h4>${area.name} | Category: ${area.category} Estimate: $ ${area.estimate.toFixed(2)} </h4>
        ${area.name == "Full Service" && `${area.checkedArea.join(", ")}`}
        <div id="areas-container">${reqHTML}</div>

    `}
    ).join('');

    return `
    <html>
    <head>
    </head>
    <body>
    <div class="div">
    <span class="span">
      <div class="div-5">
        <img
          src="https://cqpainting.com/wp-content/uploads/2016/02/FooterLogo.png"
          class="img"
        />
        <span class="span-2">
          <div class="div-6">PROPOSAL</div>
          <div class="div-7">Customer Information</div>
        </span>
      </div>
      <span class="span-3">
        <div class="div-8">
         Email: chris@cqpainting.com
         <br />
         www.cqpainting.com
          <br />
          <br />
          <br />
        </div>
        <div class="div-9">
          Name: ${data.name}
          <br />
          Phone: ${data.phone}
          <br />
          Address: ${data.address}, ${data.city} ${data.zip}
        </div>
      </span>
      <span class="span-4">JOB DESCRIPTION</span>
      <span style="font-size: 15px">
      <div id="areas-container">${areasHTML}</div>
      </span>
      <div class="div-11">
        <span style="font-size: 13px">
          <b>
          All the aforementioned tasks will be carried out in a substantial and
          skillful manner, adhering to the terms and conditions and detailed job
          information outlined above. The specified total cost for this work will
          be paid with payments to be made as described below:
          </b>
        </span>
        <br/>
        <br/>
        <div class="div-5">
          <i><span style="font-size: 15px"> <b> $${(data.cost * 0.2).toFixed(2)} - (20%) Due Now </b> </span></i>
          <span style="font-size: 15px">$${(data.cost * 0.3).toFixed(2)} - (30%) Due ${data.start} </span>
          <span style="font-size: 15px">$${(data.cost * 0.5).toFixed(2)} - Due on ${data.finish}</span>
        </div>
        <br/>
        <div class="div-12">Comments:</div>
        <span style="font-size: 15px">
            <i>
            ${data.notes}
            </i>
        </span>
        <br />
      </div>
      <div class="div-14">
      <span style="font-size: 13px">
        <b>
        You, the buyer, may cancel this transaction at any time prior to midnight of the 
        third business day after the date of acceptance of this transaction. Deposit will 
        be forfeited for cancellations made after deadline. The price quoted is for 
        acceptance within 30 days.
        </b>
      </span>
      <br />
      <br />
      <span class="span-4">ACCEPTANCE OF PROPOSAL</span>
      <br />
      <span style="font-size: 13px">
      <b>
      The above prices, specifications and conditions are satisfactory and are hereby 
      accepted. You are authorized to do the work a s specified. Payment will be made 
      as outlined above.
      </b>
    </span>
    <span class="span-10">
    <div class="div-12">Customer Signature:</div>
    <div class="div-13">Date:</div>
    </span>    
  </span>
  </div>
  <div>
  </div>
  </body>
  <style>
    .div {
      background-color: #fff;
      display: flex;
      padding: 30px;
      justify-content: space-between;
    }
    @media (max-width: 991px) {
      .div {
        flex-wrap: wrap;
        padding-right: 20px;
      }
    }
    .div-2 {
      display: flex;
      flex-basis: 0%;
      flex-direction: row;
    }
    @media (max-width: 991px) {
      .div-2 {
        display: none;
      }
    }
    .term-1 {
      flex-direction: column;
    }
    .div-3 {
      background-color: #e4d4ad;
      display: flex;
      height: 545px;
      flex-direction: column;
    }
    @media (max-width: 991px) {
      .div-3 {
        display: none;
      }
    }
    .div-4 {
      background-color: #891e1e;
      display: flex;
      height: 1455px;
      flex-direction: column;
    }
    @media (max-width: 991px) {
      .div-4 {
        display: none;
      }
    }
    .span {
      align-self: start;
      display: flex;
      flex-grow: 1;
      flex-basis: 0%;
      flex-direction: column;
    }
    @media (max-width: 991px) {
      .span {
        max-width: 100%;
        margin-top: 10px;
      }
    }
    .div-5 {
      align-self: stretch;
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 20px;
    }
    @media (max-width: 991px) {
      .div-5 {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
    .img {
      aspect-ratio: 1.15;
      object-fit: contain;
      object-position: center;
      width: 100px;
      height: 100px;
      overflow: hidden;
      max-width: 100%;
    }
    .span-2 {
      display: flex;
      flex-direction: column;
    }
    .div-6 {
      color: #000;
      text-align: right;
      font: 400 80px Inter, sans-serif;
    }
    @media (max-width: 991px) {
      .div-6 {
        font-size: 30px;
      }
    }
    .div-7 {
      color: #000;
      text-align: right;
      align-self: end;
      margin-top: 100px;
      font: 700 21px Inter, sans-serif;
    }
    @media (max-width: 991px) {
      .div-7 {
        margin-top: 40px;
      }
    }
    .span-3 {
      align-self: stretch;
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 20px;
    }
    @media (max-width: 991px) {
      .span-3 {
        max-width: 100%;
        flex-wrap: wrap;
      }
    }
    .div-8 {
      color: #000;
      flex-grow: 1;
      flex-basis: auto;
      font: 400 12px Inter, sans-serif;
    }
    @media (max-width: 991px) {
      .div-8 {
        max-width: 100%;
      }
    }
    .div-9 {
      color: #000;
      text-align: right;
      margin-top: 5px;
      flex-grow: 1;
      flex-basis: auto;
      font: 400 12px Inter, sans-serif;
    }
    @media (max-width: 991px) {
      .div-9 {
        max-width: 100%;
      }
    }
    .span-4 {
      justify-content: center;
      align-self: stretch;
      align-items: start;
      font: 600 18px Inter, sans-serif;
    }
    @media (max-width: 991px) {
      .span-4 {
        max-width: 100%;
        padding-right: 20px;
        margin-top: 10px;
      }
    }
    .div-10 {
      background-color: #000;
      align-self: center;
      margin-top: 519px;
      width: 306px;
      max-width: 100%;
      height: 20px;
    }
    @media (max-width: 991px) {
      .div-10 {
        margin-top: 40px;
      }
    }
    .div-11 {
      color: #242424;
      align-self: stretch;
      font: 400 25px Inter, sans-serif;
    }
    @media (max-width: 991px) {
      .div-11 {
        max-width: 100%;
        margin-top: 40px;
      }
    }
    .span-5 {
      align-self: stretch;
      display: flex;
      margin-top: 142px;
      justify-content: space-between;
      gap: 20px;
    }
    .span-10 {
        align-self: stretch;
        display: flex;
        margin-top: 10px;
        justify-content: space-between;
        gap: 20px;
      }
    @media (max-width: 991px) {
      .span-5 {
        max-width: 100%;
        flex-wrap: wrap;
        margin-top: 40px;
      }
    }
    .div-12 {
      color: #242424;
      flex-grow: 1;
      flex-basis: auto;
      font: 700 18px Inter, sans-serif;
    }
    @media (max-width: 991px) {
      .div-12 {
        max-width: 100%;
      }
    }
    .div-13 {
      color: #242424;
      align-self: start;
      width: 356px;
      font: 700 18px Inter, sans-serif;
    }
    .div-14 {
      color: #242424;
      align-self: stretch;
      margin-top: 10px;
      font: 400 22px Inter, sans-serif;
    }
    @media (max-width: 991px) {
      .div-14 {
        max-width: 100%;
      }
    }
  </style>
    </html>
    `;
  }

  const html = generateHTML(areas);

  let file = await printToFileAsync({
    html,
    base64: false

  })

  return (file.uri)

}


{/* <div class="term-1">
<div>
  <span style="font-size: 10px"> 1. CQ Painting, Inc. shall begin work under this agreement and continue the work hereunder to completion within a reasonable time, subject to such delays as are permissible under this contract. Owner shall obtain a valid building permit from the appropriate Public Authority if such building permit is required. If requested by Owner, CQ Painting, Inc. will obtain any required building permit. Any fee or charge which must be paid to the Public Authority in connection with the work will be paid by owner unless provide otherwise under this contract.  </span>
  <span style="font-size: 10px">2. CQ Painting, Inc. shall pay all valid bills and charges for materials and labor arising out of the construction of the structure and will hold owner of the property free and harmless against all liens and claims of lien for labor and material filed against the property. </span>
  <span style="font-size: 10px">3. Unless otherwise specified, the contract price is based upon Owner's representation that there are no conditions preventing CQ Painting, Inc. from proceeding with usual installation procedures for the materials required under this contract. Further, Owner represents that he will relocate furniture, clothing, draperies, personal effects, all personal property, plants, trees, and bushes prior to the beginning of work so that CQ Painting, Inc. has free access to portions of the area where work is to be done. In the event that Owner fails to relocate any items as provided hereunder, CQ Painting, Inc. may relocate or move any of Owner's property as may be required and is not responsible for damage thereto which may result during prosecution of the work. </span>
  <span style="font-size: 10px">4. Owner agrees to pay CQ Painting, Inc. his normal selling price for all additions, alterations or deviations. No additional work shall be done without the prior written authorization of Owner. Any such authorization shall be on a change order form, approved by both parties, which shall become a part of this Contract. Where such additional work is added to this Contract shall apply equally to such additional work. </span>
  <span style="font-size: 10px">5. CQ Painting, Inc. shall not be responsible for any damage occasioned by the Owner or Owner's agent, rain, windstorm, acts of God, or other causes beyond the control of CQ Painting, Inc., unless otherwise herein provided or unless he is obligated by the terms hereof to provided insurance against such hazard. CQ Painting, Inc. shall not be liable for damages or defects resulting from work done by subcontractors contracted by Owner. In the event Owner authorizes access through adjacent properties for CQ Painting, Inc.'s use during construction, Owner is required to obtain permission from the owners) of the adjacent properties for such access. Owner agrees to be responsible and to hold CQ Painting, Inc. harmless and accept any risks resulting from access through adjacent properties. </span>
  <span style="font-size: 10px">6. The time during which CQ Painting, Inc. is delayed in his work by (a) the acts of Owner or his agents, subcontractors or employees or those claiming under agreement with or grant from Owner, or by (b) the Acts of God which CQ Painting, Inc. could not have reasonable foreseen and provided against, or by (c)stormy or inclement weather which necessarily delays the work, or by (d) any strikes, boycotts or like obstructive actions by employees or labor organizations and which are beyond the control of CQ Painting, Inc. and which he cannot reasonable overcome, or by (e) extra work requested by the Owner, or by (1) failure of Owner to promptly pay for any extra work as authorized, shall be added to the time for completion by a fair and reasonable allowance. </span>
  <span style="font-size: 10px">7. CQ Painting, Inc. shall at his own expense carry all workers' compensation insurance and liability insurance necessary for the full protection of CQ Painting. CQ Painting Inc. and Owner during the progress of the work. Certificates of such insurance shall be filed with Owner and with said Lien Holder if Owner and Lien Holder so require. Owner agrees to procure at his own expense, prior to the commencement of any work, fire insurance with Course of Construction, all Physical Loss and Vandalism and Malicious Mischief clauses attached in a sum equal to the total cost of the improvements. </span>
  <span style="font-size: 10px">8. Where colors, textures, shades or hues are to be matched, CQ Painting, Inc. shall make every reasonable effort to do so using standard materials, but does not guarantee a perfect match. At owner's written request, CQ Painting, Inc. will provided a sample of any color, texture, shaded or hue to be used under this contract for approval or disapproval by Owner. A small fee will be charge for sample color. If Owner does not so request, CQ Painting, Inc. is authorized to apply manufacturer's standard colors, textures, shades and hues as identified in this contract and is not responsible for any discrepancy between the manufacturer's sample and the materials as applied. </span>
  <span style="font-size: 10px">9. CQ Painting, Inc. makes no warranty, express or implied (including warranty of fitness for purpose and merchantability). Any warranty or limited warranty shall be as provided by the manufacturer or the products and materials used. </span>
</div>
<div>
  <span style="font-size: 10px">10. Any controversy or claim arising out of or relating to this contract, shall be settled by arbitration in accordance with the Rules of the American Arbitration Association, and judgment in any Court having jurisdiction. </span>
  <span style="font-size: 10px">11. Should either party hereto bring suit in court to enforce the terms of this agreement, any judgment awarded shall include court costs and reasonable attorney's fees to the successful party plus interest at the legal rate. </span>
  <span style="font-size: 10px">12. Owner grants to CQ Painting, Inc. and CQ Painting, Inc.'s employees and subcontractors the right to enter the premises. </span>
  <span style="font-size: 10px">13. The Owner is solely responsible for providing CQ Painting, Inc. prior to the commencing of work with such water, electricity, heater and refuse removal service at the job site as may require by CQ Painting, Inc. to carry out this contract. Owner shall provide a toilet during the course of construction when required by law. CQ Painting, Inc. shall leave living areas "broom clean" at the completion of work </span>
  <span style="font-size: 10px">14. Work shall be completed and CQ Painting, Inc. shall be entitled to prompt payment in full when the work described in this contract has been performed. CQ Painting, Inc. is not obligated to do any work or perform any service except as expressly provided in this agreement. If, after CQ Painting, Inc. has declared the work completed, Owner claims that work still remains to be done, Owner agrees to make prompt payment of the full contract amount less only an amount needed to complete the work. Upon completion of any corrective work claimed by Owner, CQ Painting, Inc. shall be entitled to payment of the full contract amount. </span>
  <span style="font-size: 10px">15. CQ Painting, Inc. has the right to subcontract any part, or all, of the work herein agreed to be performed. </span>
  <span style="font-size: 10px">16. CQ Painting, Inc. shall have no liability for correcting any existing defect which is recognized during the course of work. </span>
  <span style="font-size: 10px">17. Owner hereby grants to CQ Painting, Inc. the right to display signs and advertise at the building, work side until all work is completed and payment in full has been made. </span>
  <span style="font-size: 10px">18. CQ Painting, Inc. shall have the right to stop work and keep the job idle if payment are not made to him when due. If any payment are not made to CQ Painting, Inc. when due, owner shall pay to CQ Painting, Inc. and additional charge of 10% of the amount of such payment. </span>
  <span style="font-size: 10px">19. Within ten days after execution of this Contract, CQ Painting, Inc. shall have the right to cancel this Contract should he determine that there is any uncertainty that all payment due under this contract will be made when due or that an error has been made in computing the cost of completing the work. </span>
  <span style="font-size: 10px">20. This agreement constitutes the entire contract and the parties are not bound by oral expression or representation by any party or agent or either party. </span>
  <span style="font-size: 10px">21. The price quoted for completion of the structure is subject to change to the extent of any difference in the cost of labor and materials as of this date and the actual cost to CQ Painting, Inc. at the time materials are purchased and work is done. </span>
  <span style="font-size: 10px">22. CQ Painting, Inc. is not responsible for labor or materials furnished by Owner or anyone working under the direction of the Owner and any loss or additional work that results therefrom shall be the responsibility of the Owner.  </span>
  <span style="font-size: 10px">23. Job labor comes with two years warranty, restrictions apply.  </span>
  <span style="font-size: 10px">24. No action arising from or related to the contract, or the performance thereof, shall be commenced by either party against the other more than two years after the completion or cessation of work under this Contract. This limitation applies to all actions of any character, whether sounding in contract, tort, or otherwise.  </span>
  <span style="font-size: 10px">25. CQ Painting, Inc. agrees to complete the work in a substantial and workmanlike manner but is not responsible for failures or defects that result from work done by others prior, at the time of or subsequent to work done under this agreement, failure to keep gutters, downspouts and valleys reasonable clear of leaves or obstructions, failure of the Owner to authorize CQ Painting, Inc. to undertake needed repairs or replacement of water-damaged, blistered, peeling or otherwise deteriorating surfaces. CQ Painting, Inc. is not liable for any act of negligence or misuse by the Owner or any other  </span>
  </div>
</div> */}