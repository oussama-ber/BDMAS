export default class Question {
  static TYPES = Object.freeze({
    SINGLE: "radiogroup",
    MULTIPLE: "checkbox",
    RATING: "rating",
    TEXT: "Comment",
  });

  static DEFAULTS = Object.freeze({
    name: "New Question",
    type: Question.TYPES.SINGLE,
    choices: [],
    choicesWithVal: [],
    rateMin: 1,
    rateMax: 5,
    minRateDescription: "Bad",
    maxRateDescription: "Good",
    coef: 1,
    isRequired: true,
  });

  constructor(params = {}) {
    const {
      name,
      type,
      choices,
      choicesWithVal,
      id,
      rateMin,
      rateMax,
      minRateDescription,
      maxRateDescription,
      coef,
      isRequired,
    } = { ...Question.DEFAULTS, ...params };
    this.name = name;
    this.type = type;
    this.choices = choices;
    this.choicesWithVal = choicesWithVal;
    this.rateMin = rateMin;
    this.rateMax = rateMax;
    this.minRateDescription = minRateDescription;
    this.maxRateDescription = maxRateDescription;
    this.coef = coef;
    this.isRequired = isRequired;
    this.id = id || Math.random();
  }

  get hasOptions() {
    return (
      this.type === Question.TYPES.SINGLE ||
      this.type === Question.TYPES.MULTIPLE
    );
  }
  get isRating() {
    return this.type === Question.TYPES.RATING;
  }

  get inputType() {
    if (this.type === Question.TYPES.SINGLE) return "radio";
    if (this.type === Question.TYPES.MULTIPLE) return "checkbox";
    throw new Error("This question does not have an input type.");
  }

  merge(patch) {
    return new Question({ ...this, ...patch });
  }
}
