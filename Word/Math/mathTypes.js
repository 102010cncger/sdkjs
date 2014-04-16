var MATH_FRACTION           	=  0;
var MATH_DEGREE             	=  1;
var MATH_DEGREESubSup       	=  2;
var MATH_RADICAL            	=  3;
var MATH_NARY               	=  4;
var MATH_DELIMITER          	=  5;
var MATH_GROUP_CHARACTER    	=  6;
var MATH_FUNCTION           	=  7;
var MATH_ACCENT             	=  8;
var MATH_BORDER_BOX         	=  9;
var MATH_LIMIT              	= 10;
var MATH_MATRIX             	= 11;
var MATH_BOX                	= 12;
var MATH_EQ_ARRAY               = 13;
var MATH_BAR                    = 14;
var MATH_PHANTOM                = 15;

var MATH_RUN                    = 16;

var BAR_FRACTION            	=  0;
var SKEWED_FRACTION         	=  1;
var LINEAR_FRACTION         	=  2;
var NO_BAR_FRACTION         	=  3;

var DEGREE_SUPERSCRIPT      	=  1;
var DEGREE_SUBSCRIPT        	= -1;

var DEGREE_SubSup           	=  1;
var DEGREE_PreSubSup        	= -1;

var SQUARE_RADICAL          	=  0;
var DEGREE_RADICAL          	=  1;

var NARY_INTEGRAL           	=  0;
var NARY_DOUBLE_INTEGRAL    	=  1;
var NARY_TRIPLE_INTEGRAL    	=  2;
var NARY_CONTOUR_INTEGRAL   	=  3;
var NARY_SURFACE_INTEGRAL   	=  4;
var NARY_VOLUME_INTEGRAL    	=  5;
var NARY_SIGMA              	=  6;
var NARY_PRODUCT            	=  7;
var NARY_COPRODUCT          	=  8;
var NARY_UNION              	=  9;
var NARY_INTERSECTION       	= 10;
var NARY_LOGICAL_OR         	= 11;
var NARY_LOGICAL_AND        	= 12;
var NARY_TEXT_OPER              = 13;

var NARY_UndOvr             	=  0;
var NARY_SubSup             	=  1;

var BOX_DIFF                	=  0;
var BOX_OpEmu               	=  1;
var BOX_ALIGN               	=  2;
var BOX_BREAK               	=  3;
var BOX_NOBREAK             	=  4;

var OPERATOR_EMPTY              = -1;
var OPERATOR_TEXT               =  0;
var PARENTHESIS_LEFT        	=  1;
var PARENTHESIS_RIGHT       	=  2;
var BRACKET_CURLY_LEFT      	=  3;
var BRACKET_CURLY_RIGHT     	=  4;
var BRACKET_SQUARE_LEFT     	=  5;
var BRACKET_SQUARE_RIGHT    	=  6;
var BRACKET_ANGLE_LEFT      	=  7;
var BRACKET_ANGLE_RIGHT     	=  8;
var HALF_SQUARE_LEFT    	    =  9;
var HALF_SQUARE_RIGHT   	    = 10;
var HALF_SQUARE_LEFT_UPPER	    = 11;
var HALF_SQUARE_RIGHT_UPPER	    = 12;
var DELIMITER_LINE              = 13;
var DELIMITER_DOUBLE_LINE       = 14;
var WHITE_SQUARE_LEFT           = 15;
var WHITE_SQUARE_RIGHT          = 16;
var BRACKET_CURLY_TOP           = 17;
var BRACKET_CURLY_BOTTOM        = 18;
var ARROW_LEFT                  = 19;
var ARROW_RIGHT                 = 20;
var ARROW_LR                    = 21;
var DOUBLE_LEFT_ARROW           = 22;
var DOUBLE_RIGHT_ARROW          = 23;
var DOUBLE_ARROW_LR             = 24;
var ACCENT_ARROW_LEFT           = 26;
var ACCENT_ARROW_RIGHT          = 27;
var ACCENT_ARROW_LR             = 28;
var ACCENT_HALF_ARROW_LEFT      = 29;
var ACCENT_HALF_ARROW_RIGHT     = 30;

var TXT_NORMAL                  =  0;
var TXT_ROMAN                   =  1;   // math roman
var TXT_SCRIPT                  =  2;
var TXT_FRAKTUR                 =  2;
var TXT_DOUBLE_STRUCK           =  3;
var TXT_SANS_SERIF              =  4;
var TXT_MONOSPACE               =  5;

/*var SCR_ROMAN                 =  0;
var SCR_SCRIPT                  =  1;
var SCR_FRAKTUR                 =  2;
var SCR_DOUBLE_STRUCK           =  3;
var SCR_SANS_SERIF              =  4;
var SCR_MONOSPACE               =  5;*/

var OPER_DELIMITER              =  0;
var OPER_SEPARATOR              =  1;
var OPER_GROUP_CHAR             =  2;
var OPER_ACCENT                 =  3;
var OPER_BAR                    =  4;


var TURN_0                      =  0;
var TURN_180                    =  1;
var TURN_MIRROR_0               =  2;
var TURN_MIRROR_180             =  3;

var DELIMITER_SHAPE_MATH        =  0;
var DELIMITER_SHAPE_CENTERED    =  1;

var LIMIT_LOW               	=  0;
var LIMIT_UP                	=  1;

//////////////////////////////////////////
var ACCENT_ONE_DOT              =  0;
var ACCENT_TWO_DOTS             =  1;
var ACCENT_THREE_DOTS           =  2;
var ACCENT_GRAVE                =  3;
var ACCENT_ACUTE                =  4;
var ACCENT_CIRCUMFLEX           =  5;
var ACCENT_COMB_CARON           =  6;
var ACCENT_LINE                 =  7;
var ACCENT_DOUBLE_LINE          =  8;
var SINGLE_LINE                 =  9;
var DOUBLE_LINE                 = 10;
var ACCENT_TILDE                = 11;
var ACCENT_BREVE                = 12;
var ACCENT_INVERT_BREVE         = 13;

var ACCENT_SIGN                 = 19;
var ACCENT_TEXT                 = 20;

/////////////////////////////////////////

var BASEJC_CENTER               =  0;
var BASEJC_TOP                  =  1;
var BASEJC_BOTTOM               =  2;

var MATH_TEXT                   =  0;
var MATH_RUN_PRP                =  1;
var MATH_COMP                   =  2;
var MATH_EMPTY                  =  3;
var MATH_PLACEHOLDER            =  4;
var MATH_PARA_RUN               =  5;


////////////////////////////////////////
var BREAK_BEFORE              =  0;
var BREAK_AFTER               =  1;
var BREAK_REPEAT              =  2;

var BREAK_MIN_MIN             =  0;
var BREAK_PLUS_MIN            =  1;
var BREAK_MIN_PLUS            =  2;



var extend = function(Child, Parent)
{
    var F = function() { };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;

}