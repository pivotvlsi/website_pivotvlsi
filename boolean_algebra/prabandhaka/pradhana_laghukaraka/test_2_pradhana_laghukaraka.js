const { प्रधान_लघुकारक } = require('./pradhana_laghukaraka.js');

console.log("=====================================================================");
console.log("Testing Pradhana Laghukaraka (Master Optimizer) with specific equation");
console.log("=====================================================================");

let equation = "((B'.D')+(A.B'.C'.E.F)+(A.B'.C'.D'.E)+(A'.B'.C.D'.F')+(A'.B'.C'.F')+(A'.B'.C'.D'.E'.F)+(B'.C'.D'.E'.F)+(A'.B'.C'.D.E.F')+(B.D)+(B.D'.E')+(B.C'.D.E')+(A.B.C'.D')+(A.B.C'.D'.E.F')+(A'.C.E)+(A.C'.D'.E.F'))";

console.log(`Original Equation: ${equation}\n`);
प्रधान_लघुकारक(equation, "SOP");

let equation2 = "((A'.B.C'.D'.F)+(A'.B.D.E'.G)+(B'.C'.F')+(A.C'.D.G')+(A.B'.C.F')+(D.E')+(A.B.C.D'.F'.G')+(A'.C.D.E'.F'.G')+(C'.G')+(B'.C.F')+(B.C'.D.F)+(A'.G'))";
console.log(`Original Equation 2: ${equation2}\n`);
प्रधान_लघुकारक(equation2, "SOP");

let equation3 = "((B.E)+(A'.C')+(A.C')+(B'.C'.D'.E)+(C.D'.E)+(B'.C.D)+(C.E')+(A'.D'.E')+(D'.E')+(A'.B'.C.E')+(A.B'.C.E)+(A'.B.D.E')+(C'.E)+(A'.B'.C'))";
console.log(`Original Equation 3: ${equation3}\n`);
प्रधान_लघुकारक(equation3, "SOP");

let equation4 = "((((A'.B'.C'.D'.F'.G'.H)+(A.B'.C.E.G'.H)).((A.B.D.F'.H)+(A'.B'.C.E'.G'.H)+(A'.C'.D.F'.G'.H)))+((A'+B+C'+E'+F'+G+H).(C+D+E'+G+H'))+((A+C'+E'+G'+H).((A.C'.D.E.F.G)+(A.B.D'.E'.F'.G)).(((B'+C+D'+G).(B'+C'+D'+E+F+G'))+(A.B'.C'.D'.E'.G))))";
console.log(`Original Equation 4: ${equation4}\n`);
प्रधान_लघुकारक(equation4, "SOP");

let equation5 = "((B+C'+D+E'+H).((A'.B'.C.D.E.F.H')+(A.B'.C.D.E'.F.G.H')).(((B'+C+D+E'+F').(B+C'+D'+E'+F+H))+(A.D.E.F')).(A'+B'+D'+F).((A'.B.C'.D.E.G)+(A.C.D'.E'.F')+(A'.D.F.G')))";
console.log(`Original Equation 5: ${equation5}\n`);
प्रधान_लघुकारक(equation5, "SOP");

console.log("Test Complete.\n");
