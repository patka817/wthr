#!/usr/bin/python
import os

#import { ReactComponent as <NAME> } from '<NAME>.svg'

icon_dir = "src/icons"
generated_file = "import React from 'react';\n"
list_of_icons = []

for filename in os.listdir(icon_dir):
    if filename.endswith('svg') == False:
        print("Skipping file " + filename)
    name = filename.split('.')[0]
    capitalized_name = name.capitalize()
    #generated_file += "import { ReactComponent as " + capitalized_name + " } from './" + filename + "';"     
    generated_file += "import " + name + " from './" + filename + "';"
    generated_file += "\n"
    list_of_icons.append(name)
generated_file += "\n"

generated_file += "export default function getIcon(name, isDay, className) {\n"
generated_file += '    const suffix = isDay ? "_day" : "_night";\n'
for icon in list_of_icons:
    generated_file += '    if (name === \'' + icon + '\' || (name + suffix) === \'' + icon + '\') {\n'
    generated_file += '        return (<img className={' + 'className} src={' + icon + '} alt="' + icon + '"  />);\n'
    generated_file += '    }\n'
generated_file += "    return null;\n"
generated_file += "};\n"

# print(generated_file)
with open(icon_dir + "/WeatherIcons.jsx", 'w+') as jsFile:
    jsFile.writelines(generated_file)
