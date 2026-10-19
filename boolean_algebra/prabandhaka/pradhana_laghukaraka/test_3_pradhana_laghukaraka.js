const { प्रधान_लघुकारक } = require('./pradhana_laghukaraka.js');

console.log("=====================================================================");
console.log("Testing Pradhana Laghukaraka (Master Optimizer) with specific equation");
console.log("=====================================================================");

let equation1 = "((B'.D')+(A.B'.C'.E.F)+(A.B'.C'.D'.E)+(A'.B'.C.D'.F')+(A'.B'.C'.F')+(A'.B'.C'.D'.E'.F)+(B'.C'.D'.E'.F)+(A'.B'.C'.D.E.F')+(B.D)+(B.D'.E')+(B.C'.D.E')+(A.B.C'.D')+(A.B.C'.D'.E.F')+(A'.C.E)+(A.C'.D'.E.F'))";

console.log(`Original Equation: ${equation1}\n`);
प्रधान_लघुकारक(equation1, "SOP");

console.log("\n---------------------------------------------------------------------");
console.log("Test 2 Complete.\n");

let equation2 = "((B'+C'+D).(B+C'+D'+F').(A'+D+E+F).(B'+C+D+E'+F').(B'+C+D+E).(A'+B+F).(A'+C+D'+E+F').(A'+F').(B'+C'+D+E).(B+F').(A+B'+C+D+F').(A'+B+C'+D+E+F').(B'+C+E+F).(A+B+D'+F))";

console.log(`Original Equation 2: ${equation2}\n`);
प्रधान_लघुकारक(equation2, "POS");

console.log("\n---------------------------------------------------------------------");
console.log("Test 3 Complete.\n");

let equation3 = "((A.D.F.G)+(C'.D'.H')+(A'.B'.D.E'.G)+(A'.C'.E'.F'.G)+(A.D.F.H)+(A'.B.C'.D.E'.F'.G'.H)+(A.C.D'.E.F'.H)+(A.B.D.E.F'.G.H')+(A.B'.D'.E.F'.G.H)+(A.C.E.H)+(B.D'.E'.F.G'.H')+(A'.F'.H')+(B.D.E'.G)+(B'.E'.H')+(B'.D.E.F'.G))";

console.log(`Original Equation 3: ${equation3}\n`);
प्रधान_लघुकारक(equation3, "SOP");

console.log("Test 3 Complete.\n");

let equation4 = "((((A'+C'+E'+F'+H').(B+D+E+G'+H))+((C+D+E'+F'+G').(B+C+D+E'+F'+G'))+(B.E'.F.G'.H)).((A.B.C.F.H)+(B.C.D.E'.F)).(((A'+B+C+D'+E+F+G).(A'+B+C'+D+E+G'+H').(A+B+E'+F'+H))+((A+B+C'+E'+G'+H').(B+C'+F'+G).(A+B'+D+E+F).(B'+C'+D'+E+F'+G'+H'))))";

console.log(`Original Equation 4: ${equation4}\n`);
प्रधान_लघुकारक(equation4, "SOP");

console.log("Test 4 Complete.\n");
