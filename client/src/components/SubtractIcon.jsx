const SubtractIcon = () => {
  return(
    <svg className="group" width="34" height="34" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect className="cursor-pointer transition duration-[250ms] fill-white group-hover:fill-black" x="0.5" y="0.5" width="33" height="33" rx="7.5" stroke="black" /*style="fill: rgb(255, 255, 255);"*//>
    <mask id="mask0_64_1578" style={{mask:"alpha"}} maskUnits="userSpaceOnUse" x="5" y="5" width="24" height="24">
      <rect x="5" y="5" width="24" height="24" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_64_1578)">
      <path className="cursor-pointer transition duration-[250ms] fill-black group-hover:fill-white" d="M10 18V16H24V18H10Z" /*fill="black"*//>
    </g>
  </svg> 
  );
}

export default SubtractIcon