import { Command, CommandBase, CommandParser, Event } from '@autobot/common';
import { RichEmbed }                                  from 'discord.js';
import * as fs                                        from 'fs';
import { ListFilesCommand }                           from './ListFilesCommand';

/**
 * Outputs the filenames.
 */
@Command
export class HelpCommand extends CommandBase {

    public static readonly BLOCKED_FILES: Array<string> = [ 'lost+found' ];

    public constructor() {

        //
        // Set this commands configuration.
        //
        super({

            event: Event.MESSAGE,
            name: `${ process.env.DOCSBOT_PREFIX_LIST }`,
            group: 'docs',
            requiredEnvVars: [

                'DOCSBOT_HELP_PREFIX',
                'DOCSBOT_PREFIX_SEARCH',
                'DOCSBOT_SAVE_PATH',
                'DOCSBOT_ADMIN_ROLE_NAME',
                'DOCSBOT_PREFIX_UPDATE'

            ],
            roles: [

                process.env.DOCSBOT_ADMIN_ROLE_NAME

            ],
            description: 'Outputs help information.'

        });

    }

    /**
     * Called when a command matches config.name.
     *
     * @param command Parsed out commamd
     *
     */
    public async run(command: CommandParser) {

        const result = fs.readdirSync(process.env.DOCSBOT_SAVE_PATH);

        if (result) {

            command.obj.channel.send(new RichEmbed().setTitle(`devdocs help`)
                                                    .setDescription(`docsbot is a bot that searches devdocs.io`)
                                                    .setColor(3447003)
                                                    .addField('searching', `use \`${ process.env.DOCSBOT_PREFIX_SEARCH }<language> <method>\` such as \`${ process.env.DOCSBOT_PREFIX_SEARCH }javascript async\``)
                                                    .addField('searchable languages list', result.filter(val => ListFilesCommand.BLOCKED_FILES.indexOf(val) === -1).join(', ').replace(/\.json/g, ''))
                                                    .addField('downloading new languages', `use \`${ process.env.DOCSBOT_PREFIX_UPDATE } <language>\` such as \`${ process.env.DOCSBOT_PREFIX_UPDATE } javascript\``)
                                                    .setURL('https://github.com/autobots-rocks/autobot-docsbot'));

        } else {

            command.obj.channel.send(new RichEmbed().setTitle('devdocs')
                                                    .setColor(3447003)
                                                    .setDescription(`Could not list commands directory!`));

        }

    }


}
