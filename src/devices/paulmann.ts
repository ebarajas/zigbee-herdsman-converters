import {Definition} from '../lib/types';
import * as exposes from '../lib/exposes';
import fz from '../converters/fromZigbee';
import extend from '../lib/extend';
const e = exposes.presets;

const definitions: Definition[] = [
    {
        zigbeeModel: ['501.34'],
        model: '501.34',
        vendor: 'Paulmann',
        description: 'Smart switch 4 buttons white',
        fromZigbee: [fz.command_on, fz.command_off, fz.battery, fz.command_move, fz.command_stop],
        toZigbee: [],
        exposes: [e.battery(), e.action(['on_1', 'off_1', 'on_2', 'off_2', 'brightness_move_up_1', 'brightness_move_down_1',
            'brightness_move_stop_1', 'brightness_move_up_2', 'brightness_move_down_2', 'brightness_move_stop_2'])],
        meta: {multiEndpoint: true},
    },
    {
        zigbeeModel: ['H036-0007'],
        model: '929.66',
        vendor: 'Paulmann',
        description: 'Smart home Zigbee LED module coin 1x2.5W RGBW',
        extend: extend.light_onoff_brightness_colortemp_color(),
    },
    {
        zigbeeModel: ['Switch Controller'],
        model: '50043',
        vendor: 'Paulmann',
        description: 'SmartHome Zigbee Cephei Switch Controller',
        extend: extend.switch(),
    },
    {
        zigbeeModel: ['50131'],
        model: '501.31',
        vendor: 'Paulmann',
        description: 'Smart plug for Euro- and Schuko-sockets',
        extend: extend.switch(),
    },
    {
        zigbeeModel: ['Dimmablelight'],
        model: '50044/50045',
        vendor: 'Paulmann',
        description: 'SmartHome Zigbee Dimmer or LED-stripe',
        extend: extend.light_onoff_brightness(),
    },
    {
        zigbeeModel: ['500.47'],
        model: '500.47',
        vendor: 'Paulmann',
        description: 'SmartHome Zigbee MaxLED RGBW controller max. 72W 24V DC',
        extend: extend.light_onoff_brightness_colortemp_color(),
    },
    {
        zigbeeModel: ['RGBW light', '500.49', 'RGBW_light'],
        model: '50049/500.63',
        vendor: 'Paulmann',
        description: 'Smart Home Zigbee YourLED RGB Controller max. 60W / Smart Home Zigbee LED Reflektor 3,5W GU10 RGBW dimmbar',
        extend: extend.light_onoff_brightness_colortemp_color(),
    },
    {
        zigbeeModel: ['RGBCW_LIGHT'],
        model: '4137',
        vendor: 'Paulmann',
        description: 'Smart Home Zigbee LED bulb 9,3W Matt E27 RGBW',
        extend: extend.light_onoff_brightness_colortemp_color({colorTempRange: [153, 370]}),
    },
    {
        fingerprint: [{modelID: 'RGBW Controller', manufacturerName: 'Paulmann Licht'}],
        model: '94191',
        vendor: 'Paulmann',
        description: 'Plug & shine LED strip',
        extend: extend.light_onoff_brightness_colortemp_color({colorTempRange: [153, 370]}),
    },
    {
        fingerprint: [
            {modelID: 'CCT Light', manufacturerName: 'Paulmann lamp'},
            {modelID: 'CCT', manufacturerName: 'Paulmann Licht GmbH'},
        ],
        zigbeeModel: ['CCT light', 'CCT_light', 'CCT light '],
        model: '50064',
        vendor: 'Paulmann',
        description: 'SmartHome led spot',
        extend: extend.light_onoff_brightness_colortemp(),
    },
    {
        zigbeeModel: ['500.46', 'H036-0006'],
        model: '929.63',
        vendor: 'Paulmann',
        description: 'SmartHome Zigbee LED-Modul Coin 1x6W Tunable White',
        extend: extend.light_onoff_brightness_colortemp(),
    },
    {
        zigbeeModel: ['H036-0005'],
        model: '929.60',
        vendor: 'Paulmann',
        description: 'SmartHome Zigbee LED-Modul Coin 1x6W White',
        extend: extend.light_onoff_brightness(),
    },
    {
        zigbeeModel: ['371000001'],
        model: '371000001',
        vendor: 'Paulmann',
        description: 'SmartHome led spot tuneable white',
        extend: extend.light_onoff_brightness_colortemp(),
    },
    {
        zigbeeModel: ['371000002'],
        model: '371000002',
        vendor: 'Paulmann',
        description: 'Amaris LED panels',
        extend: extend.light_onoff_brightness_colortemp_color(),
    },
    {
        zigbeeModel: ['371232040'],
        model: '371232040',
        vendor: 'Paulmann',
        description: 'LED panels',
        extend: extend.light_onoff_brightness_colortemp_color({colorTempRange: [153, 350]}),
    },
    {
        zigbeeModel: ['500.44'],
        model: '500.44',
        vendor: 'Paulmann',
        description: 'URail power supply',
        extend: extend.light_onoff_brightness_color(),
    },
    {
        zigbeeModel: ['500.45'],
        model: '500.45',
        vendor: 'Paulmann',
        description: 'SmartHome Zigbee Pendulum Light Aptare',
        extend: extend.light_onoff_brightness(),
    },
    {
        zigbeeModel: ['500.48'],
        model: '500.48',
        vendor: 'Paulmann',
        description: 'SmartHome Zigbee YourLED dim/switch controller max. 60 W',
        extend: extend.light_onoff_brightness(),
    },
    {
        zigbeeModel: ['H036-0001'],
        model: '93999',
        vendor: 'Paulmann',
        description: 'Plug Shine Zigbee controller',
        extend: extend.light_onoff_brightness(),
    },
    {
        zigbeeModel: ['RemoteControl'],
        model: '500.67',
        vendor: 'Paulmann',
        description: 'RGB remote control',
        fromZigbee: [fz.command_on, fz.command_off, fz.command_toggle, fz.command_step, fz.command_move_to_color_temp,
            fz.command_move_to_color, fz.command_stop, fz.command_move, fz.command_color_loop_set,
            fz.command_ehanced_move_to_hue_and_saturation, fz.tint_scene],
        toZigbee: [],
        exposes: [e.action([
            'on', 'off', 'toggle', 'brightness_step_up', 'brightness_step_down', 'color_temperature_move', 'color_move', 'brightness_stop',
            'brightness_move_down', 'brightness_move_up', 'color_loop_set', 'enhanced_move_to_hue_and_saturation', 'scene_*'])],
    },
];

module.exports = definitions;
