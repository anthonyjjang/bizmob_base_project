module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        // 프로덕션 환경에서는 console 사용에 대해 경고를 표시하고, 그 외 환경에서는 금지하지 않음.
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

        // 프로덕션 환경에서 debugger 사용에 대해 경고를 표시하고, 그 외 환경에서는 금지하지 않음.
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

        // Vue.js에서 deprecated(사용 중단 예정인)된 slot 속성 사용을 금지하지 않음.
        'vue/no-deprecated-slot-attribute': 'off',

        // Vue.js의 특정 주석 지시어 사용을 금지하지 않음.
        'vue/comment-directive': 'off',

        // TypeScript의 any 타입 사용을 금지하지 않음.
        '@typescript-eslint/no-explicit-any': 'off',

        // TypeScript의 사용하지 않는 변수 오류 off
        '@typescript-eslint/no-unused-vars': 'off',

        // Vue 컴포넌트 이름을 여러 단어로 구성하는 것에 대해 규칙을 적용하지 않음.
        'vue/multi-word-component-names': 0,

        // Vue 3의 컴파일러 매크로(`defineProps`, `defineEmits` 등) 사용을 금지하지 않음.
        'vue/setup-compiler-macros': 0,

        // 문단 마지막 항상 세미콜론
        'semi': [ 'error', 'always' ],

        // single quote 사용
        'quotes': [ 'error', 'single' ],

        // Tab은 Space n칸으로 정의
        'indent': [ 'error', 4, { 'SwitchCase': 1 } ], // 4칸

        // var 선언 금지 off
        'no-var': 'off',

        // arguments 객체 사용 금지 off
        'prefer-rest-params': 'off',
    },
    overrides: [{
        'files': [ '*.ts', '*.vue' ],
        'rules': {
            'no-undef': 'off'
        }
    }],
    ignorePatterns: [
        // 'public/bizMOB/'
    ]
};
