import { required } from 'type-plus'
import { FuncStruct, parseFn } from './tersifyFunctionByString.js'

describe('parseFn()', () => {
	function testParseFn(str: string, struct: Partial<FuncStruct>) {
		test(str, () =>
			expect(parseFn(str)).toEqual(
				required<FuncStruct>(
					struct.type === 'function'
						? {
								name: '',
								params: '',
								body: '',
								async: false,
								generator: false
							}
						: {
								params: '',
								body: '',
								async: false,
								singleParam: false,
								singleLineBody: false
							},
					struct
				)
			)
		)
	}
	testParseFn.only = (str: string, struct: Partial<FuncStruct>) => {
		// biome-ignore lint/suspicious/noFocusedTests: utility function
		test.only(str, () =>
			expect(parseFn(str)).toEqual(
				required<FuncStruct>(
					struct.type === 'function'
						? {
								name: '',
								params: '',
								body: '',
								async: false,
								generator: false
							}
						: {
								params: '',
								body: '',
								async: false,
								singleParam: false,
								singleLineBody: false
							},
					struct
				)
			)
		)
	}
	describe('anonymous function', () => {
		testParseFn('function () {}', {
			type: 'function'
		})
		testParseFn('function() {}', {
			type: 'function'
		})
		testParseFn('function(){}', {
			type: 'function'
		})
		testParseFn('function \t  ()  \t{}', {
			type: 'function'
		})
		testParseFn('function(){ }', {
			type: 'function'
		})
		testParseFn('function( ){ }', {
			type: 'function'
		})
		testParseFn('function( a ){}', {
			type: 'function',
			params: 'a'
		})
		testParseFn('function(a,b){}', {
			type: 'function',
			params: 'a,b'
		})
		testParseFn('function(a = 0){}', {
			type: 'function',
			params: 'a = 0'
		})
		testParseFn('function(a={x:1}){}', {
			type: 'function',
			params: 'a={x:1}'
		})
		testParseFn(
			`function(){
  return a;
}`,
			{
				type: 'function',
				body: `return a;`
			}
		)
		testParseFn(
			`function(){
  a ++
  return a;
  }`,
			{
				type: 'function',
				body: `a ++; return a;`
			}
		)
	})
	describe('named function', () => {
		testParseFn(`function foo(){}`, {
			type: 'function',
			name: 'foo'
		})
		testParseFn(`function foo (){}`, {
			type: 'function',
			name: 'foo'
		})
		testParseFn(`function \tfoo\t (){}`, {
			type: 'function',
			name: 'foo'
		})
	})
	describe('function with modifiers', () => {
		testParseFn('async function() {}', {
			type: 'function',
			async: true
		})
		testParseFn('async \tfunction() {}', {
			type: 'function',
			async: true
		})
		testParseFn('function*() {}', {
			type: 'function',
			generator: true
		})
		testParseFn('function* foo() {}', {
			type: 'function',
			name: 'foo',
			generator: true
		})
		testParseFn('function*foo() {}', {
			type: 'function',
			name: 'foo',
			generator: true
		})
		testParseFn('function *() {}', {
			type: 'function',
			generator: true
		})
	})
	describe('arrow', () => {
		testParseFn('()=>{}', {
			type: 'arrow'
		})
		testParseFn('() => {}', {
			type: 'arrow'
		})
		testParseFn('() \t=>\t {}', {
			type: 'arrow'
		})
		testParseFn('() \t=>\t {}', {
			type: 'arrow'
		})
		testParseFn('(a)=>{}', {
			type: 'arrow',
			params: 'a',
			singleParam: true
		})
		testParseFn('( a, b  )=>{}', {
			type: 'arrow',
			params: 'a, b'
		})
		testParseFn('( a, b =1 )=>{}', {
			type: 'arrow',
			params: 'a, b =1'
		})
		testParseFn('a=>{}', {
			type: 'arrow',
			params: 'a',
			singleParam: true
		})
		testParseFn('() => a', {
			type: 'arrow',
			body: 'a',
			singleLineBody: true
		})
		testParseFn('() => ({})', {
			type: 'arrow',
			body: '({})',
			singleLineBody: true
		})
		testParseFn(
			`() => (
  {
    a: 1
  }
)`,
			{
				type: 'arrow',
				body: `( { a: 1 } )`,
				singleLineBody: true
			}
		)
		testParseFn(
			`() => {
      return 1;
    }`,
			{
				type: 'arrow',
				body: `1`,
				singleLineBody: true
			}
		)
		testParseFn(
			`a => {
      return a;
    }`,
			{
				type: 'arrow',
				params: 'a',
				body: `a`,
				singleParam: true,
				singleLineBody: true
			}
		)
		testParseFn(
			`a => {
      return {a:1};
    }`,
			{
				type: 'arrow',
				params: 'a',
				body: `({a:1})`,
				singleParam: true,
				singleLineBody: true
			}
		)
	})
	describe('async arrow', () => {
		testParseFn('async () => {}', {
			type: 'arrow',
			async: true
		})
		testParseFn('async()=>{}', {
			type: 'arrow',
			async: true
		})
		testParseFn('async a=>a', {
			type: 'arrow',
			params: 'a',
			body: 'a',
			async: true,
			singleParam: true,
			singleLineBody: true
		})
	})
})
