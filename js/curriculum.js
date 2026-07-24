/* ============================================================
   LEARNING GARDEN — curriculum.js · the Grade-2 year plan
   Researched against real standards (Common Core Math & ELA, NGSS,
   C3 social studies, ACTFL early-language, ISTE) — each subject
   independently verified, then sequenced into 36 school weeks so
   every skill lands AFTER its prerequisites. Zero prerequisite
   violations; all 175 app skills scheduled exactly once.

   This is the source of truth for what a child learns and WHEN.
   The Learn tab's weekly path and the Grown-ups roadmap both read
   from it. Kids move at their own pace — "week" is a position in
   the sequence, not a deadline.
   ============================================================ */

const CURRICULUM = {
  totalWeeks: 36,
  philosophy: 'This year moves like a real classroom: math and reading run every single day as the steady backbone, while science, social studies, Spanish, and computer time rotate in so no two days feel the same. We build strictly from the ground up — counting, place value, and letter-sounds before regrouping, three-digit work, and comprehension — and we keep circling back to the make-or-break skills (addition/subtraction facts within 20, sight words, and smooth reading) all year so they truly stick. Each week names one thing to really cement, so your child always knows what "winning" looks like.',
  weeks: [
    { w: 1, theme: 'Welcome Back — Everyone Has a Place', focus: 'Fluent skip-counting by 5s and 10s to anchor place-value thinking.', mins: 25, skills: ['skip5', 'skip10', 'skip2', 'hw_upper', 'vowel_sound', 'read_story', 'slg', 'sp_greet_q'] },
    { w: 2, theme: 'What Each Number Is Worth', focus: 'Read the value of the hundreds, tens, and ones in a 3-digit number.', mins: 25, skills: ['skip100', 'countback', 'pv_digit', 'hw_lower', 'rhyme', 'soc_compass', 'comp_parts'] },
    { w: 3, theme: 'Building Big Numbers', focus: 'Build numbers to 1,000 with base-ten blocks (100 = ten tens).', mins: 25, skills: ['pv_tens', 'pv_hundreds', 'pv_expanded', 'silent_e', 'hw_words', 'hw_numbers', 'read_facts', 'soc_mapread'] },
    { w: 4, theme: 'Three Ways to Say a Number', focus: 'Write a number in standard, expanded, and word form.', mins: 25, skills: ['pv_standard', 'pv_words', 'pv_compare', 'digraph', 'best_material', 'soc_world', 'comp_actions'] },
    { w: 5, theme: 'Bigger, Smaller, Just Right', focus: 'Compare and order 3-digit numbers using >, =, and <.', mins: 25, skills: ['pv_order', 'pv_compare_true', 'pv_ten_more', 'spell_correct', 'soc_grid_map'] },
    { w: 6, theme: 'Facts at Our Fingertips', focus: 'Mentally add/subtract 10 and 100; begin memorizing addition facts.', mins: 30, skills: ['pv_hundred_more', 'mental_jumps', 'add_facts', 'state_change', 'comp_tools'] },
    { w: 7, theme: 'Doubles and Speedy Sums', focus: 'Recall addition facts within 20 from memory using doubles.', mins: 30, skills: ['add_doubles', 'sub_facts', 'plurals'] },
    { w: 8, theme: 'Families of Facts', focus: 'Use fact families to find the missing number in an equation.', mins: 30, skills: ['fact_family', 'add_missing', 'ela_irreg_plural', 'comp_safe'] },
    { w: 9, theme: 'Story Math', focus: 'Solve one-step add/subtract story problems within 20.', mins: 30, skills: ['sub_missing', 'word_add', 'word_sub', 'contractions', 'soc_helpers', 'type_home_q'] },
    { w: 10, theme: 'Counting by Tens', focus: 'Add and subtract whole tens fluently as a place-value strategy.', mins: 30, skills: ['add_tens', 'sub_tens', 'ela_contraction_expand', 'compound', 'sp_num_q'] },
    { w: 11, theme: 'Two-Digit Teamwork', focus: 'Add two 2-digit numbers with no regrouping using place value.', mins: 30, skills: ['add_2d', 'syllables', 'soc_rules'] },
    { w: 12, theme: 'Carry the One', focus: 'Regroup (carry) when adding two 2-digit numbers.', mins: 30, skills: ['add_2d_re', 'sub_2d', 'affix_meaning', 'noun_id', 'sci_seed_travel', 'soc_citizen'] },
    { w: 13, theme: 'Borrowing and Building', focus: 'Subtract two 2-digit numbers, including borrowing.', mins: 30, skills: ['sub_2d_re', 'add_3', 'add_multi'] },
    { w: 14, theme: 'Hop, Skip, and Jump the Number Line', focus: 'Show sums and differences by hopping on a number line.', mins: 35, skills: ['line_find', 'line_point', 'line_hop', 'ela_collective', 'verb_id', 'type_toprow'] },
    { w: 15, theme: 'Real-World Problem Solvers', focus: 'Solve one-step word problems within 100.', mins: 35, skills: ['word_comp', 'ela_past_tense', 'habitat', 'soc_leaders', 'type_bottomrow'] },
    { w: 16, theme: 'Two Steps at a Time', focus: 'Solve compare and two-step word problems within 100.', mins: 35, skills: ['word_two', 'sp_color_q', 'animal_groups'] },
    { w: 17, theme: 'Reaching for the Hundreds', focus: 'Add within 1,000 using models and drawings.', mins: 35, skills: ['add_3d', 'adj_id', 'ela_adverb', 'earth_features', 'soc_goods', 'type_letters_q'] },
    { w: 18, theme: 'All the Way to a Thousand', focus: 'Subtract within 1,000, including across zeros.', mins: 35, skills: ['sub_3d', 'ela_er_est', 'soc_needs', 'comp_keys'] },
    { w: 19, theme: 'Show Your Thinking', focus: 'Explain WHY an add/subtract strategy works.', mins: 35, skills: ['ela_reflexive', 'sentence_type', 'life_cycle'] },
    { w: 20, theme: 'Measure Up', focus: 'Measure length to the nearest whole unit with a ruler.', mins: 35, skills: ['meas_ruler', 'meas_unit', 'soc_money', 'sp_school_q'] },
    { w: 21, theme: 'Estimate, Then Check', focus: 'Choose the right unit and estimate before measuring.', mins: 35, skills: ['meas_two_units', 'meas_estimate', 'meas_compare', 'capitalization', 'end_punct', 'earth_changes', 'type_words_q'] },
    { w: 22, theme: 'Every Inch Counts', focus: 'Solve length word problems and compare lengths.', mins: 35, skills: ['meas_word', 'synonyms', 'soc_producers', 'type_caps'] },
    { w: 23, theme: 'Tick-Tock Around the Clock', focus: 'Tell time to the nearest 5 minutes.', mins: 35, skills: ['time_hour', 'time_5', 'antonyms', 'type_sentence_q'] },
    { w: 24, theme: 'Morning, Noon, and Night', focus: 'Use a.m./p.m. and reason about later times.', mins: 35, skills: ['time_ampm', 'time_word', 'homophones', 'soc_symbols_q', 'sp_days_q'] },
    { w: 25, theme: 'Coins in the Jar', focus: 'Count a mixed set of coins and bills.', mins: 35, skills: ['time_elapsed', 'money_count', 'money_make', 'ela_shades', 'odd_one_out', 'type_punct'] },
    { w: 26, theme: 'Making Cents of It', focus: 'Solve money word problems with $ and ¢.', mins: 35, skills: ['money_change', 'money_word', 'abc_order', 'ela_abc2', 'soc_holidays', 'type_sent2'] },
    { w: 27, theme: 'Tally It Up', focus: 'Collect data and record it with tally marks.', mins: 35, skills: ['data_tally', 'ela_dictionary', 'soc_symbols_deep', 'weather_type', 'sci_sound'] },
    { w: 28, theme: 'Picture the Data', focus: 'Draw picture graphs and bar graphs from a data set.', mins: 40, skills: ['data_bar', 'data_picto', 'soc_pastpresent', 'sp_family_q', 'sci_light'] },
    { w: 29, theme: 'Reading Between the Bars', focus: 'Read line plots and generate your own measurement data.', mins: 40, skills: ['data_lineplot', 'soc_timeline', 'plant_parts', 'thermometer', 'sci_machine_id'] },
    { w: 30, theme: 'Shapes All Around Us', focus: 'Name 2-D shapes and draw a shape from its attributes.', mins: 40, skills: ['geo_name', 'geo_sides', 'soc_famous', 'sp_animal_q', 'sci_machine_pick'] },
    { w: 31, theme: 'Faces, Sides, and Rows', focus: 'Describe solids and partition rectangles into rows and columns.', mins: 40, skills: ['geo_3d', 'geo_faces', 'geo_partition', 'rrr'] },
    { w: 32, theme: 'Fair Shares for Everyone', focus: 'Split shapes into halves, thirds, and fourths (equal shares).', mins: 40, skills: ['geo_frac', 'geo_equal', 'living', 'push_pull'] },
    { w: 33, theme: 'Evens, Odds, and Equal Groups', focus: 'Even/odd and writing an even number as two equal groups.', mins: 40, skills: ['evenodd', 'mult_groups', 'sp_food_q', 'magnets'] },
    { w: 34, theme: 'Rows, Columns, and Quick Counting', focus: 'Use equal groups and arrays as repeated addition.', mins: 40, skills: ['mult_array', 'mult_rows', 'food_chain', 'sci_season_id'] },
    { w: 35, theme: 'Patterns and Predictions', focus: 'Extend and describe patterns (reinforcing skip-counting).', mins: 35, skills: ['pattern', 'pattern_rule', 'adaptations', 'sci_chain_order', 'sci_season_next', 'sci_sky'] },
    { w: 36, theme: 'Look How Far We\'ve Come', focus: 'Celebrate and cement: add/subtract facts within 20 from memory.', mins: 35, skills: [] },
  ],
};

// flat first-teach order: every skill in the sequence the year intends
const CURRICULUM_ORDER = CURRICULUM.weeks.flatMap(w => w.skills);
const CURRICULUM_WEEK_OF = (() => {
  const m = {};
  CURRICULUM.weeks.forEach(w => w.skills.forEach(s => { m[s] = w.w; }));
  return m;
})();
// which curriculum week a skill belongs to (0 = not in the plan)
function curriculumWeekOf(skillId) { return CURRICULUM_WEEK_OF[skillId] || 0; }
